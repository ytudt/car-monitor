import Mock from 'mockjs';

Mock.mock(/api\/vehicles$/, 'get', {
  "success": true,
  "data": [
    {"id": 111, "carNumber": "京A1111", "lat": 39.9077, "lng": 116.426285, "online": true},
    {"id": 12, "carNumber": "京A22222", "lat": 39.9377, "lng": 116.437285, "online": false},
    {"id": 12, "carNumber": "京A33333", "lat": 39.9677, "lng": 116.448285, "online": false},
    {"id": 12, "carNumber": "京A44444", "lat": 39.9977, "lng": 116.459285, "online": true},
    {"id": 12, "carNumber": "京A55555", "lat": 39.9177, "lng": 116.460285, "online": false},
  ],
  "messageCode": null,
  "message": "登录成功!"
});

Mock.mock(/api\/vehicle\/京A1111/, 'get', {
  "success": true,
  "data": [{
    "lat": 39.90015,
    "lng": 116.3466,
  }, {
    "lat": 39.80015,
    "lng": 116.3466,
  },
    {
      "lat": 39.70015,
      "lng": 116.3466,
    },
    {
      "lat": 39.60015,
      "lng": 116.3466,
    },
    {
      "lat": 39.50015,
      "lng": 116.3466,
    }

  ],
  "messageCode": null,
  "message": "登录成功!"
});


Mock.mock(/api\/vehicle\/京A1111/, 'get', {
  "success": true,
  "data": [{
    "lat": 39.90015,
    "lng": 116.3466,
  }, {
    "lat": 39.80015,
    "lng": 116.3466,
  },
    {
      "lat": 39.70015,
      "lng": 116.3466,
    },
    {
      "lat": 39.60015,
      "lng": 116.3466,
    },
    {
      "lat": 39.50015,
      "lng": 116.3466,
    }

  ],
  "messageCode": null,
  "message": "登录成功!"
});


Mock.mock(/api\/vehicle\/京A22222/, 'get', {
  "success": true,
  "data": [{
    "lat": 39.90015,
    "lng": 116.5466,
  }, {
    "lat": 39.80015,
    "lng": 116.5466,
  },
    {
      "lat": 39.70015,
      "lng": 116.5466,
    },
    {
      "lat": 39.60015,
      "lng": 116.5466,
    },
    {
      "lat": 39.50015,
      "lng": 116.5466,
    }

  ],
  "messageCode": null,
  "message": "登录成功!"
});

