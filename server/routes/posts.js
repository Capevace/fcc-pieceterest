const { Types } = require('mongoose');
const requestIp = require('request-ip');
const { Post, User } = require('../schemas');
const map = require('async/map');

module.exports = (app) => {
  app.get('/api/posts', (req, res) => {
    const query = req.query.user
      ? { poster: req.query.user }
      : {};

    Post.find(query)
      .sort({ 'createdAt': 'desc' })
      .limit(10)
      .then(results => {
        map(results, (result, callback) => {
          User.findOne({ _id: result.poster })
            .then(user => {
              callback(null, Object.assign({}, result._doc, {
                posterDisplayName: user.twitter.displayName
              }));
            })
            .catch(error => callback(error));
        }, (err, posts) => {
          if (err) {
            catchError(err, res);
            return;
          }

          res.json({
            posts: posts
          });
        });
      })
      .catch(err => catchError(err, res));
  });

  app.post('/api/post', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'You gotta be logged in.'
      });
      return;
    }

    if (!(req.body.description && req.body.pictureUrl)) {
      res.status(400).json({
        status: 400,
        message: 'You didn\'t fill out the form properly.'
      });
      return;
    }

    Post.create({
      description: req.body.description,
      poster: req.user._id,
      pictureUrl: req.body.pictureUrl,
      likes: [],
      createdAt: new Date()
    });

    res.status(200).json({
      status: 200
    });
  });

  app.post('/api/post/:id/like', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'You gotta be logged in.'
      });
      return;
    }

    Post.findOne({ _id: req.params.id })
      .then(result => {
        if (!result) {
          res.status(404).json({
            status: 404,
            message: 'Post not found.'
          });
          return
        }

        if (result.likes.indexOf(Types.ObjectId(req.user._id)) === -1)
          result.likes.push(req.user._id);
        else
          result.likes.splice(result.likes.indexOf(Types.ObjectId(req.user._id)), 1);

        result.save(err => {
          if (err) {
            throw err;
            return;
          }

          res.json({
            status: 200,
            result
          });
        });
      })
      .catch(err => catchError(err, res));
  });

  function catchError(err, res) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error.'
    });
  }
};
