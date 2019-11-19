class User {

    constructor(name, email, password, bornDate) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.bornDate = bornDate;
    }

    toString = function () {
        console.log(
            "Se crea el usuario: {" + 
            "name: " + this.name + " \n" +
            "email: " + this.email + " \n" +
            "password: " + this.password + " \n" +
            "bornDate: " + this.bornDate + " };"
        );
    }
}