(function(){

	function drawSegmentedRing(options){
		var graphics = new PIXI.Graphics();

		function draw(){
			graphics.clear();
			graphics.lineStyle(1, 0x000000, 1);

			var r1 = options.radius - options.width;
			var r2 = options.radius;
			var x0 = options.x;
			var y0 = options.y;


			var mask = new PIXI.Graphics();
			mask.beginFill();
			mask.drawCircle(x0+0.5,y0+0.5, r2+0.3);
			mask.drawCircle(x0+0.5,y0+0.5,r1-0.3);
			mask.endFill();
			graphics.mask = mask;


			var increment = 360 / options.segments;
			//graphics.beginFill(0xffffff);

			for(var i = 0; i < options.segments; i += 1){
				var theta1 = (increment * i) * Math.PI / 180;
				var thetaMid = (increment * (i+0.5)) * Math.PI / 180;
				var theta2 = (increment * (i+1)) * Math.PI / 180;
				var x1 = r1 * Math.cos(theta1) + x0;
				var y1 = r1 * Math.sin(theta1) + y0;
				var x2 = r2 * Math.cos(theta1) + x0;
				var y2 = r2 * Math.sin(theta1) + y0;

				var x3 = r1 * Math.cos(theta2) + x0;
				var y3 = r1 * Math.sin(theta2) + y0;
				var x4 = r2 * Math.cos(theta2) + x0;
				var y4 = r2 * Math.sin(theta2) + y0;

				var xMid = (r2 * 2) * Math.cos(thetaMid) + x0;
				var yMid = (r2 * 2) * Math.sin(thetaMid) + y0;

				var range = _.find(options.ranges, function(range){
					return i >= range.start && i < range.end;
				});

				if(range){
					graphics.beginFill(range.fill);
				} else {
					graphics.beginFill(0xFFFFFF);
				}

				graphics.moveTo(x1,y1);
				graphics.lineTo(x2,y2);
				graphics.lineTo(xMid, yMid);
				graphics.lineTo(x4,y4);
				graphics.lineTo(x3,y3);
				graphics.endFill();
			}

			graphics.drawCircle(x0,y0, r2);
			graphics.drawCircle(x0,y0, r1);
		}

		draw();

		stage.addChild(graphics);

		return {
			draw: draw
		};
	}


	var stage = new PIXI.Stage(0xFFFFFF, true);

	stage.setInteractive(true);

	var renderer = PIXI.autoDetectRenderer(620,380, null, false, true);
	renderer.view.style.display = 'block';

	document.body.appendChild(renderer.view);

	var monthRanges = [
		{start: 0, end: 0, fill: 0xFF7640}
	];
	var dayRanges = [
		{start: 0, end: 0, fill: 0xFFAD40}
	];
	var hourRanges = [
		{start: 0, end: 0, fill: 0x3F66BF}
	];
	var minuteRanges = [
		{start: 0, end: 0, fill:  0x799EF2}
	];
	var secondRanges = [
		{start: 0, end: 0, fill: 0x99B8FF}
	];

	var monthRadius = 175;
	var monthWidth = 6.25;

	var dayRadius = monthRadius - monthWidth;
	var dayWidth = 12.5;

	var hourRadius = dayRadius - dayWidth;
	var hourWidth = 25;

	var minuteRadius = hourRadius - hourWidth;
	var minuteWidth = 30;

	var secondRadius = minuteRadius - minuteWidth;
	var secondWidth = 40;

	var monthRing = drawSegmentedRing({
		x: 200,
		y: 200,
		radius: monthRadius,
		width: monthWidth,
		segments: 12,
		ranges: monthRanges
	});

	var dayRing = drawSegmentedRing({
		x: 200,
		y: 200,
		radius: dayRadius,
		width: dayWidth,
		segments: 31,
		ranges: dayRanges
	});

	var hourRing = drawSegmentedRing({
		x: 200,
		y: 200,
		radius: hourRadius,
		width: hourWidth,
		segments: 24,
		ranges: hourRanges
	});
	var minuteRing = drawSegmentedRing({
		x: 200,
		y: 200,
		radius: minuteRadius,
		width: minuteWidth,
		segments: 60,
		ranges: minuteRanges
	});
	var secondRing = drawSegmentedRing({
		x: 200,
		y: 200,
		radius: secondRadius,
		width: secondWidth,
		segments: 60,
		ranges: secondRanges
	});

	var time = {
		seconds: 0,
		minutes: 0,
		hours: 0,
		days: 0
	};

	function incrementTime(){
		var d = new Date();
		time.seconds = d.getSeconds();
		time.minutes = d.getMinutes();
		time.hours = d.getHours();
		time.days = d.getDate();
		time.month = d.getMonth() + 1;

		monthRanges[0].end = time.month;
		secondRanges[0].end = time.seconds;
		minuteRanges[0].end = time.minutes;
		hourRanges[0].end = time.hours;
		dayRanges[0].end = time.days;
	}

	incrementTime();

	setInterval(function(){
		incrementTime();
	}, 1000);

	function animate(){
		monthRing.draw();
		dayRing.draw();
		hourRing.draw();
		minuteRing.draw();
		secondRing.draw();
		renderer.render(stage);
		requestAnimFrame(animate);
	}

	requestAnimFrame( animate );

	renderer.render(stage);

})();