from app import app
from flask import render_template

@app.route('/api/line')
def computeLine():
  val2 = 18910
  val1 = 23
  result = val1+2*val2
  return {"result":result} 
