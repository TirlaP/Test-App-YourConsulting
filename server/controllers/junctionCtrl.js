module.exports = (db) => {
  return {
    create: (req, res) => {
      console.log(req.body);
      db.models.Junction.create(req.body)
        .then(() => {
          res.send({ success: true });
        })
        .catch((e) => {
          console.log(e);
          res.status(401);
        });
    },

    update: (req, res) => {
      db.models.Junction.update(req.body, { where: { id: req.body.id } })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },

    findAll: (req, res) => {
      db.query(
        `SELECT id_car, id_person
        FROM "Junction"`,
        { type: db.QueryTypes.SELECT }
      )
        .then((resp) => {
          res.send(resp);
        })
        .catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(
        `SELECT id_car, id_person
        FROM "Junction" WHERE id = ${req.params.id}`,
        { type: db.QueryTypes.SELECT }
      )
        .then((resp) => {
          res.send(resp[0]);
        })
        .catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Junction" WHERE id_person = ${req.params.id}`, {
        type: db.QueryTypes.DELETE,
      })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },
  };
};
