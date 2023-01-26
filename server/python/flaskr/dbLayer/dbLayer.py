import psycopg2
import random
from datetime import datetime

class DB():
    def __init__(self,dbstring):
        self.basemodel = BaseModel(dbstring)
        # Initialize the tables and the columns
        
        self.tables={}
        allTables=self.basemodel._executeQuery("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';", [])
        print(allTables)
        for table in allTables:
            print(table)
            self.tables[table[0]]=Table(self.basemodel, table[0])

        print(self)
    

    def __getitem__(self, item):
        return self.tables[item]

    def __repr__(self):
        return "DB("+repr(self.tables)+")"

class Table ():
    def __init__(self, basemodel, name):
        self.name=name
        self.basemodel=basemodel
        self.columns=self.getColumns()


    def __repr__(self):
        return "Table("+repr(self.columns)+")"

    def getRecords(self, limit=10, params={}, suffix=""):
        finalstring=""
        finallist=[]
        
        for key, value in params.items():
            finalstring+=str(key)+" = %s and "
            finallist.append(value)

        return self.basemodel._executeQuery(f"SELECT * FROM {self.name} WHERE {finalstring[:-4]} {suffix} LIMIT {limit}", finallist)

    def getRecord(self, params={}):
        finalstring=""
        finallist=[]
        
        for key, value in params.items():
            finalstring+=str(key)+" = %s and"
            finallist.append(value)

        return self.basemodel._executeQuery(f"SELECT * FROM {self.name} WHERE {finalstring[:-3]} LIMIT 1;", finallist)

    def getColumns(self, params={}):
        # table_name => string must be first value in params!!
        finalstring="WHERE table_name = '"+self.name+"'"
        finallist=[]
        
        for key, value in params.items():
            finalstring+="and "+key+" = '"+value+"'"
            finallist.append(value)

        return [x[0] for x in self.basemodel._executeQuery("SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS "+finalstring, finallist)]

    def updateRecord(self, toUpdate, params):
        strWhere=""
        strToUpdate=""

        for key,value in params.items():
            strWhere+=f"{key}='{value}',"

        for key,value in toUpdate.items():
            strToUpdate+=f"{key}='{value}',"

        
        self.basemodel._executeQuery(f"""UPDATE {self.name}
        SET {strToUpdate[:-1]}
        WHERE {strWhere[:-1]}""", [])
    
    def genID(self):
        return random.randint(1000000,9999999)

    def getTime(self):
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def createEntry(self, params={}):
        vals=[]

        columns=self.getColumns({"is_nullable":"NO"})
        
        for field in columns:
            if("id" in field):
                vals.append(self.genID())
            elif("time" in field):
                vals.append(f"{self.getTime()}")

        


        for key,value in params.items():
            try:
                vals.append(str(value).replace("'",""))
                columns.append(key)
            except Exception as err:
                return str(err)
        
        columns=repr(tuple(columns)).replace("'","")
        valstr=repr(tuple(vals))
        msg=f"""INSERT INTO {self.name} {columns} VALUES {valstr};"""
        #return msg
        result = self.basemodel._executeQuery(msg)

        if(result == False):
            return False
        
        return dict(zip(columns, vals))


class Record():
    def __init__(self, params):
        self.params=params

class BaseModel():
    def __init__(self, dbstring):
        self.conn=psycopg2.connect(dsn=dbstring)

    def _executeQuery(self, qstring, params=[]):
        # This code takes a query and executes it
        qtype=qstring.split(" ")[0]
        cursor = self.conn.cursor()

        cursor.execute(qstring, params)

        try:
            self.conn.commit()
        except:
            return False
        

        if(qtype=="SELECT"):
            result=cursor.fetchall()
            if(cursor.rowcount==0):
                return None
        elif(qtype=="INSERT"):
            result=True
        else:
            result=True

        cursor.close()

        return result