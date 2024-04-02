describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Sushant Bajracharya",
      username: "sushant",
      password: "bajracharya",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    cy.visit("");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2023",
    );
  });

  it("login form can be opened", function () {
    cy.contains("log in").click();
  });

  it("user can login", function () {
    cy.contains("log in").click();
    cy.get("#username").type("sushant");
    cy.get("#password").type("bajracharya");
    cy.get("#login-button").click();

    cy.contains("Sushant Bajracharya logged in");
  });

  it("login fails with wrong password", function () {
    cy.contains("log in").click();
    cy.get("#username").type("sushant");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();
    cy.get(".error")
      .should("contain", "wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");
    cy.get("html").should("not.contain", "Sushant Bajracharya logged in");
    // cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    // cy.get(".error").should("have.css", "border-style", "solid");
  });

  describe("when logged in", function () {
    describe("and several notes exists", function () {
      beforeEach(function () {
        cy.login({ username: "sushant", password: "bajracharya" });
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it("one of those can be made important", function () {
        // cy.contains("second note").contains("make important").click(); // error if item in span or others
        // cy.contains("second note").contains("make not important");
        cy.contains("second note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make not important");
      });
    });

    beforeEach(function () {
      cy.login({ username: "sushant", password: "bajracharya" });
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type("a note created by cypress");
      cy.contains("save").click();
      cy.contains("a note created by cypress");
    });

    // describe("and a note exists", function () {
    //   beforeEach(function () {
    //     cy.createNote({
    //       content: "another note cypress",
    //       makeImportant: true,
    //     });
    //   });

    //   it("it can be made not important", function () {
    //     cy.contains("another note cypress")
    //       .contains("make not important")
    //       .click();
    //     cy.contains("another note cypress").contains("make important");
    //   });
    // });
  });
});
