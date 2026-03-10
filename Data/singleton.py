import psycopg2
from psycopg2.extras import RealDictCursor


class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance._connection = psycopg2.connect(
                host="localhost",
                database="campus_exchange",
                user="postgres",
                password="password",
                port=5432
            )
            cls._instance._connection.autocommit = True
        return cls._instance

    def get_connection(self):
        return self._connection

    def get_cursor(self):
        return self._connection.cursor(cursor_factory=RealDictCursor)