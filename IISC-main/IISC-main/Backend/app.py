from flask import Flask,request,send_file
from flask_cors import CORS
import random
import cv2
import numpy as np
from ultralytics import YOLO
app = Flask(__name__)
CORS(app)

my_file = open("coco.txt", "r")
data = my_file.read()
class_list = data.split("\n")
my_file.close()
detection_colors = []
for i in range(len(class_list)):
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    detection_colors.append((b, g, r))
model = YOLO("best.pt", "v8")
frame_wid = 640
frame_hyt = 480

@app.route('/objectdetection',methods=['POST'])
def objectdetection():
    file = request.files['image']
    print(file)
    cap=cv2.imread(file)
    frame = cv2.resize(cap, (frame_wid, frame_hyt))
    detect_params = model.predict(source=[frame], conf=0.55, save=False)
    DP = detect_params[0].numpy()
    for i in range(len(detect_params[0])):
        boxes = detect_params[0].boxes
        box = boxes[i]  # returns one box
        clsID = box.cls.numpy()[0]
        conf = box.conf.numpy()[0]
        bb = box.xyxy.numpy()[0]

        cv2.rectangle(
            frame,
            (int(bb[0]), int(bb[1])),
            (int(bb[2]), int(bb[3])),
            detection_colors[int(clsID)],
            3,
        )

        
        font = cv2.FONT_HERSHEY_COMPLEX
        cv2.putText(
            frame,
            class_list[int(clsID)] + " " + str(round(conf, 3)) + "%",
            (int(bb[0]), int(bb[1]) - 10),
            font,
            1,
            (255, 255, 255),
            2,
        )
            
    cv2.imwrite('output.jpg',frame)
    return send_file('./output.jpg') 



if __name__ == '__main__':
    app.run(debug=True)
