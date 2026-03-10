from singleton import Database


def initialize_database():
    db = Database()
    cursor = db.get_cursor()

    with open("schema.sql", "r") as f:
        schema = f.read()

    cursor.execute(schema)
    cursor.close()

    print("Database initialized successfully.")


if __name__ == "__main__":
    initialize_database()