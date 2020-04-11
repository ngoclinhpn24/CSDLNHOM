const db = require('../databases/init');

class Model {

    static table = "";
    static primaryKey = "id";
    static timestamps = true;

    static async find(id) {
        let result = null;
        try {
            let [rows] = await db.promise().query(`SELECT * FROM ${this.table} WHERE ${this.primaryKey} = '${id}'`);
            if (!rows[0]) return null;
            result = Object.assign(new this(), rows[0]);

        } catch (err) {
            console.log(err.message);
        }
        return result;
    }

    static async selectWhere(queryString) {
        if (queryString.trim() == 'all') {
            queryString = '1';
        }

        let results = [];
        try {
            let [rows] = await db.promise().query(`
                SELECT * FROM ${this.table}
                WHERE ${queryString.trim()}
            `);

            for (let row of rows) {
                let result = Object.assign(new this(), row);
                results.push(result);
            }
        } catch (err) {
            console.log(err.message);
        }

        return results;
    }

    static async create(data) {
        let columns = Object.keys(data).join(',');
        let values = Object.values(data).map(function (item) {
            return `'${item}'`;
        }).join(',');

        let result = null;
        try {
            let insertion = await db.promise().query(`INSERT INTO ${this.table} (${columns}, dateModified) VALUE (${values}, NOW())`);
            result = await this.find(insertion[0].insertId);

        } catch (err) {
            console.log(err.message);
        }

        return result;
    }

    static async updateWhere(data, queryString) {
        if(queryString == 'all') queryString = '1';
        let changes = Object.keys(data).map(function(key){
            return `${key} = '${data[key]}'`;
        }).join(',');


        try {
            let update = await db.promise().query(`UPDATE ${this.table} SET ${changes} WHERE ${queryString.trim()}`);
            return update;
        } catch (err) {
            console.error(err.message);
        }
    }

    static async deleteWhere(queryString) {
        if(queryString == 'all') queryString = 1;
        try {
            let destroy = await db.promise().query(`DELETE FROM ${this.table} WHERE ${queryString.trim()}`);
            return destroy;
        } catch (err){
            console.error(err.message);
        }
    }

    async save() {
        let primaryKey = this.constructor.primaryKey;
        let table = this.constructor.table;
        let data = Object.assign({}, this);
        if(this.id){
            // update
            // console.log('update');
            let changes = Object.keys(data).filter(function(key){
                if(key == primaryKey || key == 'dateModified') return false;
                return true;
            }).map(function(key){
                return `${key} = '${data[key]}'`;
            }).join(',');

            try {
                // let query = `UPDATE ${table} SET ${changes} WHERE ${primaryKey} = '${this.id}'`;
                await db.promise().query(`UPDATE ${table} SET ${changes} WHERE ${primaryKey} = '${this.id}'`);
            } catch (err){
                console.error(err.message);
            }
        } else {
            delete data[primaryKey];
            delete data['dateModified'];

            let columns = Object.keys(data).join(',');
            let values = Object.values(data).map(function (item) {
                return `'${item}'`;
            }).join(',');

            try {
                let insertion = await db.promise().query(`INSERT INTO ${table} (${columns}, dateModified) VALUE (${values}, NOW())`);
                this.id = insertion[0].insertId;
            } catch (err) {
                console.log(err.message);
            }
        }
    }

    async delete() {
        let primaryKey = this.constructor.primaryKey;
        let table = this.constructor.table;
        try {
            if(!this.id) return;
            await db.promise().query(`DELETE FROM ${table} WHERE ${primaryKey} = '${this.id}'`);
        } catch(err){
            console.log(err.message);
        }
    }


}

module.exports = Model;