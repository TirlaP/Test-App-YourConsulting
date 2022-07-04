module.exports = (db) => {
  return {
    create: (req, res) => {
      db.models.Person.create(req.body)
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },

    update: (req, res) => {
      db.models.Person.update(req.body, { where: { id: req.body.id } })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },

    /*
    Relatia din tabelul de jonctiune
    `SELECT "Person".id, "Person".nume, "Person".prenume,"Person".cnp, "Car".marca, "Car".model, "Car".fabricatie
        FROM "Person"
        JOIN junction ON junction.id_person = "Person".id   
        JOIN "Car" ON junction.id_car = "Car".id
        ORDER BY "Person".nume;`,
    */

    findAll: (req, res) => {
      db.query(
        `SELECT id, nume, prenume, cnp, age, selectedcars
        FROM "Person"
        ORDER BY id`,
        { type: db.QueryTypes.SELECT }
      )
        .then((resp) => {
          res.send(resp);
        })
        .catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(
        `SELECT id, nume, prenume, cnp, age, selectedcars
          FROM "Person" WHERE id = ${req.params.id}`,
        { type: db.QueryTypes.SELECT }
      )
        .then((resp) => {
          res.send(resp[0]);
        })
        .catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Person" WHERE id = ${req.params.id}`, {
        type: db.QueryTypes.DELETE,
      })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },
  };
};
