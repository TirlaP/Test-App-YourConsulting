module.exports = (sequelize, DataType) => {
  let model = sequelize.define(
    "Person",
    {
      nume: {
        type: DataType.TEXT,
      },
      prenume: {
        type: DataType.TEXT,
      },
      cnp: {
        type: DataType.TEXT,
      },
      age: {
        type: DataType.INTEGER,
      },
      selectedcars: {
        type: DataType.ARRAY(DataType.TEXT),
      },
    },
    {
      timestamps: true,
    }
  );
  return model;
};

/*
Ok. Deci ce fac in momentul in care creez persoana in modal?

Am acel multiselect care ar trebui sa faca legatura in tabelul de jonctiune intre persoana si masinile detinute de acea persoana.

1. Adica, fac legatura precum am facut atunci cand am creat tabelul de Jonctiune, printr-o relatie Many-to-Many

2. Dupa asta, din baza de date etrag campurile de care am nevoie, pentru a le putea afisa in tabeul de persoane

3. Creez tabelul final folosind "rowspan", iar printr-un for voi afisa persoanele din baza de date, iar printr-un alt for ( cred ) voi afisa masinile care au legatura cu acea persoana in tabelul de jonctiune.

4. Cu alte cuvinte, voi afisa pur si simplu relatiile din tabelul de jonctiune

----------------------------------------------------------------------------------------

Ok. De unde incep, si cum ar trebui sa creez din cod relatiile dintre id_person si id_car?

1. 


*/
