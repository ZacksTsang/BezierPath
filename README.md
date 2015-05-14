# BezierPath
利用贝塞尔曲线实现地图上两个点之间的连线弯曲效果。
## js 
目前是 js 的实现方式

### example
```
var bezier = new BezierPath(startlatlng,endlatlng,true);
// 曲线角度
bezier.MakePath(90);
// 转化为 geojson
line = bezier.toMapBoxFeature({ name: 'routes',color:'#1087bf',weight:2 });
```
