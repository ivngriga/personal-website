import os;
from flask import Flask;

import sys; 
sys.path.append("/Users/ivano/Desktop/ivngriga-website/server/python/flaskr")


from routes import bp;

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DBDSN="host='127.0.0.1' dbname='flask-db' user='postgres' password='Qazwer333'"
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    print("HIIII")
    blueprint=bp(app,True)
    app.register_blueprint(blueprint.blueprint)

    return app