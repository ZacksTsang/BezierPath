/*
 * 根据贝塞尔曲线获取两个经纬度之间的曲线
 */

'use strict';

var PI = Math.PI;

/*
 * 初始贝塞尔曲线值
 * params:
 * 		start: {lat:112,lng:22} 起点
 * 		end: {lat:112,lng:22} 终点
 * 		isClockWise: bool 是否顺时针
 */
var BezierPath = function(start,end,isClockWise){
    this.geometries = [];
	this.start = start;
	this.end = end;
	this.clockWise = isClockWise;
}

/*
 * 绘制曲线
 *
 * params:
 * 		angle: 绘制角度 范围：0~90
 */
BezierPath.prototype.MakePath = function(angle) {
	this.angle = angle;
    
    var auxiliaryPoint = this.AuxiliaryPoint();

    var bezier1x;
    var bezier1y;
    var bezier2x;
    var bezier2y;


    var bezier_x;
    var bezier_y;

    var t = 0;
    while ( this.geometries.length <= 100 ) {
        

        bezier1x = this.start.lng + ( auxiliaryPoint.lng - this.start.lng ) * t;
        bezier1y = this.start.lat + ( auxiliaryPoint.lat - this.start.lat ) * t;
        

        bezier2x = auxiliaryPoint.lng + ( this.end.lng - auxiliaryPoint.lng ) * t;
        bezier2y = auxiliaryPoint.lat + ( this.end.lat - auxiliaryPoint.lat ) * t;
        

        bezier_x = bezier1x + ( bezier2x - bezier1x ) * t;
        bezier_y  = bezier1y + ( bezier2y - bezier1y ) * t;
        

        this.geometries.push({lat:bezier_y,lng:bezier_x});
        
        t += 0.01;
        
    }

}


/*
 * 获取辅助点
 * 
 */
BezierPath.prototype.AuxiliaryPoint = function() {
	if (this.angle < 0) {
		this.angle = 0;
	}else if(this.angle > 180){
		this.angle = 180;
	}

	var target = {lat:0,lng:0};

	// 两点之间的角度
	var btpAngle = Math.atan2(this.start.lat-this.end.lat,this.start.lng-this.end.lng)*180/PI;

	// 中间点
	var center = {lat:(this.start.lat+this.end.lat)/2,lng:(this.start.lng+this.end.lng)/2};

	// 距离
	var distance = Math.sqrt((this.start.lat-this.end.lat)*(this.start.lat-this.end.lat)+(this.start.lng-this.end.lng)*(this.start.lng-this.end.lng))

	// 中间点到辅助点的距离
	var adis = (distance/2.0)*Math.tan(this.angle*PI/180.0);

	// 辅助点的经纬度
    	var auxAngle = Math.abs(btpAngle) > 90 ? 180 - Math.abs(btpAngle):Math.abs(btpAngle);
	var lat = adis*Math.sin((90 - auxAngle)*PI/180);
	var lng = adis*Math.cos((90 - auxAngle)*PI/180);

	if (this.start.lat>this.end.lat) {
		this.isClockWise = !this.isClockWise;
	}
	if (btpAngle >= 90) {
		target.lat = center.lat + (this.isClockWise?lat:-1*lat);
		target.lng = center.lng + (this.isClockWise?lng:-1*lng);
	}else{
	        target.lat = center.lat + (this.isClockWise?lat:-1*lat);
	        target.lng = center.lng - (this.isClockWise?lng:-1*lng);
	}

	if (target.lat > 90) {
	        target.lat = 90.0;
	}else if (target.lat <- 90){
	        target.lat = -90.0;
	}
	    
	if (target.lng > 180) {
	        target.lng = target.lng-360.0;
	}else if (target.lng <- 180){
	        target.lng = 360.0 + target.lng;
	}

    return target;
}


/*
 * 转化 mapbox feature data
 */
BezierPath.prototype.toMapBoxFeature = function(properties) {
	properties = properties || {};

	if (this.geometries.length <= 0) {
        return {'geometry': { 'type': 'LineString', 'coordinates': null },
                'type': 'Feature', 'properties': properties
               };
    } else {
        var multiline = [];
        for (var i = 0; i < this.geometries.length ; i++) {
            multiline.push([this.geometries[i].lng,this.geometries[i].lat]);
        }
        return {'geometry': { 'type': 'LineString', 'coordinates': multiline },
                'type': 'Feature', 'properties': properties};
    }
};
