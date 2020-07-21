const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');
const jwt = require('jsonwebtoken');
const Post = require('../../api/models/postModel');

chai.use(chaiHttp);

console.log = () => {}

function serverError(resData){
  resData.should.have.status(500);
  resData.should.be.a('object');
  resData.body.should.have.property('message');
  resData.body.message.should.equal('Erreur serveur.');
}

before(() => { console.warn("Début des test") })
// beforeEach(() => { console.warn("Début d'un test") })
// afterEach(() => { console.warn("Fin d'un test") })
after(() => { console.warn("Fin des test") })

describe('Request : Post', () => {

  /*
  * GET /posts
  */
  describe('GET /posts', () => {

    it("should get all the posts with a status code of 200", (done) => {
      chai.request(server)
      .get('/posts')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        // res.body.length.should.be.eql(0);
        done();
      })
    })

    it('should not get all the posts and return a status code of 404', (done) => {
      chai.request(server)
      .get('/post') // Wrong uri
      .end((err, res) => {
        res.should.have.status(404);
        done();
      })
    })

  })


  /*
  * POST /posts
  */
  describe('POST /posts', () => {

    it('should create a post', (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }

      let userData = {
        email: "jacques@test.fr"
      }

      jwt.sign({userData}, process.env.JWT_KEY, {expiresIn: '30 days'}, (error, token) => {

        chai.request(server)
        .post('/posts')
        .set('Authorization', token)
        .send(postData)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('created_at');
          done();
        });

      })

    })

    it('should not create a post because of missing required parameter', (done) => {
      let postData = {
        content: "Lorem ipsum dolor sit amet."
      }

      let userData = {
        email: "jacques@test.fr"
      }

      jwt.sign({userData}, process.env.JWT_KEY, {expiresIn: '30 days'}, (error, token) => {

        chai.request(server)
        .post('/posts')
        .set('Authorization', token)
        .send(postData)
        .end((err, res) => {
          serverError(res);
          done();
        });

      })

    })

    it('should not create a post because of missing authorization header', (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }

      chai.request(server)
      .post('/posts')
      .send(postData)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Accès interdit');
        done();
      });


    })

    it('should not create a post because of missing token', (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }

      chai.request(server)
      .post('/posts')
      .set('Authorization', "")
      .send(postData)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Accès interdit');
        done();
      });


    })


  })

  /*
  * GET /posts/:post_id
  */
  describe('GET /posts/:post_id', () => {

    it('should retrieve a post by the given id', (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .get('/posts/' + post.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('created_at');
          done();
        })
      })
    })

    it('should not retrieve a post because non existing id', (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .get('/posts/' + "randomId")
        .end((err, res) => {
          serverError(res);
          done();
        })
      })
    })

  })

  /*
  * PUT /posts/:post_id
  */
  describe("PUT /posts/:post_id", () => {

    it("should update a post title and content given the id", (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .put('/posts/' + post.id)
        .send({title: "Nouveau nom d'article", content: "Nouveau contenu"})
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('title').eql("Nouveau nom d'article");
          res.body.should.have.property('content').eql("Nouveau contenu");
          res.body.should.have.property('title').not.eql("Article test");
          res.body.should.have.property('content').not.eql("Lorem ipsum dolor sit amet");
          done();
        })
      })
    })

    it("should update a post title given the id", (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .put('/posts/' + post.id)
        .send({title: "Nouveau nom d'article"})
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('title').eql("Nouveau nom d'article");
          res.body.should.have.property('title').not.eql("Article test");
          done();
        })
      })
    })

    it("should not update a post given the id", (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .put('/posts/' + post.id)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('title').eql("Article test");
          res.body.should.have.property('content').eql("Lorem ipsum dolor sit amet.");
          res.body.should.have.property('title').not.eql("Nouveau nom d'article");
          res.body.should.have.property('content').not.eql("Nouveau contenu");
          done();
        })
      })
    })

    it("should not update a post given non required parameter", (done) => {
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .put('/posts/' + post.id)
        .send({age: 18})
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('title').eql("Article test");
          res.body.should.have.property('content').eql("Lorem ipsum dolor sit amet.");
          res.body.should.have.property('title').not.eql("Nouveau nom d'article");
          res.body.should.have.property('content').not.eql("Nouveau contenu");
          done();
        })
      })
    })

  })

  /*
  * DELETE /posts/:post_id
  */

  describe("DELETE /posts/:post_id", () => {

    it("should delete a post given the id", (done) => {

      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .delete('/posts/' + post.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('message').eql("Article supprimé");
          done();
        })
      })

    })

    it("should delete a post given an non existing id", (done) => {

      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet."
      }
      let post = new Post(postData);

      post.save()
      .then(post => {
        chai.request(server)
        .delete('/posts/' + "randomId")
        .end((err, res) => {
          serverError(res);
          done();
        })
      })

    })

  })
})
