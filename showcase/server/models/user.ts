const users: User[] = Array<User>();

class User {
	email: String;
	password: String;
	firstname: String;
	lastname: String;
	picture: String;
	roles: Array<String>;

	static create(user: User) {
		users.push(user);
		return require('q')(user);
	}

	static findByEmail(email: String) {
		let results = users.filter((user) => {
			return user.email === email;
		});
		return require('q')(results && results.length ? results[0] : null);
	}

	constructor(data:any = {}) {
		this.email = data.email;
		this.password = data.password;
		this.firstname = data.firstname;
		this.lastname = data.lastname;
		this.picture = data.picture;
		this.roles = data.roles;
	}
}

module.exports = User;
