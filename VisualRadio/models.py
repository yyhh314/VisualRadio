# Data Storage Layer(데이터 저장 계층)
# 애플리케이션의 데이터를 저장하는 계층입니다.
# 주로 데이터베이스를 이용하여 구현합니다.


# Flask 서버의 Data Storage Layer를 하나의 파일로 만들려면, 
# 이 파일에 데이터베이스와의 연동 로직과 데이터를 CRUD하는 함수들을 구현해야 합니다.
# 일반적으로 이러한 파일은 'models.py'와 같이 이름을 지정합니다. 
# 이는 Django에서도 흔히 사용되는 네이밍 컨벤션 중 하나입니다.


# 데이터베이스 모델을 정의해두는 곳이.ㅁ

# SQLAlchemy 라이브러리를 사용하여 ORM(Object Relational Mapping)을 구현

from VisualRadio import db
# app = Flask(__name__)
# db 객체 생성 (SQLAlchemy 객체를 전역 변수로 두기)

# 저 db는 __init__에서 생성한 그 db임
class Wav(db.Model):
    
    broadcast = db.Column(db.String(20), nullable=False, default="None")
    radio_name = db.Column(db.String(50), primary_key=True)
    radio_date = db.Column(db.String(50), primary_key=True)
    raw = db.Column(db.Boolean, default=False)
    section = db.Column(db.Integer, nullable=False, default=0)
    stt = db.Column(db.Boolean, nullable=False, default=False)
    script = db.Column(db.Boolean, nullable=False, default=False)
    contents = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, broadcast, radio_name, radio_date, raw, section, stt, script, contents):
        self.broadcast = broadcast
        self.radio_name = radio_name
        self.radio_date = radio_date
        self.raw = raw
        self.section = section
        self.stt = stt
        self.script = script
        self.contents = contents

    def __repr__(self):
        return f"<Radio {self.broadcast} {self.radio_name} {self.radio_date} : (raw : {self.raw}), (section: {self.section}), (stt: {self.stt}), (script: {self.script}), (contents: {self.contents}))>\n"



