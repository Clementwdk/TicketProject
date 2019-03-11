const express = require('express');

const router = express.Router();
const methodOverride = require('method-override');
const Ticket = require('../models/Ticket');

router.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

router
  .route('/')
  .get((req, res, next) => {
    Ticket.find({}, (err, tickets) => {
      if (err) {
        return console.error(err);
      }
      res.format({
        html() {
          res.render('ticket/index', {
            title: 'All my tickets',
            tickets
          });
        },
        json() {
          res.json(tickets);
        }
      });
    });
  })
  .post((req, res) => {
    const { description } = req.body;
    const { urgency } = req.body;
    const { numberproblem } = req.body;
    Ticket.create({
        description,
        urgency,
        numberproblem
      },
      (err, ticket) => {
        if (err) {
          res.send('There was a problem adding the information to the database.');
        } else {
          console.log(`POST creating new ticket: ${ticket}`);
          res.format({
            html() {
              res.location('tickets');
              res.redirect('/tickets');
            },
            json() {
              res.json(ticket);
            }
          });
        }
      });
  });

router.get('/new', (req, res) => {
  res.render('ticket/new', {
    title: 'Add New ticket'
  });
});
router.param('id', (req, res, next, id) => {
  Ticket.findById(id, (err, ticket) => {
    if (err) {
      console.log(`${id} was not found`);
      res.status(404);
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
        html() {
          next(err);
        },
        json() {
          res.json({
            message: `${err.status} ${err}`
          });
        }
      });
    } else {
      req.id = id;
      next();
    }
  });
});

router.route('/:id').get((req, res) => {
  Ticket.findById(req.id, (err, ticket) => {
    if (err) {
      console.log(`GET Error: There was a problem retrieving: ${err}`);
    } else {
      console.log(`GET Retrieving ID: ${ticket._id}`);
      res.format({
        html() {
          res.render('ticket/show', {
            ticket,
            id: ticket._id
          });
        },
        json() {
          res.json(ticket);
        }
      });
    }
  });
});

router
  .route('/:id/edit')
  .get((req, res) => {
    Ticket.findById(req.id, (err, ticket) => {
      if (err) {
        console.log(`GET Error: There was a problem retrieving: ${err}`);
      } else {
        console.log(`GET Retrieving ID: ${ticket._id}`);
        res.format({
          html() {
            res.render('ticket/edit', {
              title: `ticket${ticket._id}`,
              ticket,
              id: ticket._id
            });
          },
          json() {
            res.json(ticket);
          }
        });
      }
    });
  })
  .put((req, res) => {
    const { description } = req.body;
    const { numberproblem } = req.body;
    const { urgency } = req.body;
    Ticket.findById(req.id, (err, ticket) => {
      ticket.update({
          description,
          badge,
          numberproblem,
          urgency
        },
        (err) => {
          if (err) {
            res.send(`There was a problem updating the information to the database: ${err}`);
          } else {
            res.format({
              html() {
                res.redirect(`/ticket/${ticket._id}`);
              },
              json() {
                res.json(ticket);
              }
            });
          }
        });
    });
  })
  .delete((req, res) => {
    Ticket.findById(req.id, (err, ticket) => {
      if (err) {
        return console.error(err);
      }
      ticket.remove((err, ticket) => {
        if (err) {
          return console.error(err);
        }
        console.log(`DELETE removing ID: ${ticket._id}`);
        res.format({
          html() {
            res.redirect('/tickets');
          },
          json() {
            res.json({
              message: 'deleted',
              item: ticket
            });
          }
        });
      });
    });
  });

module.exports = router;
