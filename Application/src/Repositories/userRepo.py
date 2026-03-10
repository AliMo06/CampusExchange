from Data.singleton import Database

class UserRepository:

    def create_user(self, email, password_hash, first_name, last_name, campus_id):
        db = Database()
        cursor = db.get_cursor()

        query = """
        INSERT INTO users (email, password_hash, first_name, last_name, campus_id)
        VALUES (%s,%s,%s,%s,%s)
        RETURNING user_id;
        """

        cursor.execute(query, (email, password_hash, first_name, last_name, campus_id))
        user_id = cursor.fetchone()["user_id"]
        cursor.close()

        return user_id