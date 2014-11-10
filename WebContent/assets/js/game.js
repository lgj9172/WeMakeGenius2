//게임 공통 요소 처리 모듈
var game = function(){

	//필요한 엘리먼트 캐싱
	var elem = {
		This : 			$('#page_games'),
		score : 		$('#score'),
		startMessge : 	$('#start_message'),
		finishMessage : $('#finish_message'),
		gameHeader : 	$('.game-info-header'),
		timer : 		$('#timer'),
		progess : 		$('#timeline-progress')
	};

	var type = null;

	//문제 풀이시 획득 포인트
	var acqPoint = 1000;

	var point = 0;
	var combo = 0;

	var limitSec = 60;
	
	var sycPoint = function(){
		elem.score.html(point+' Point'+'&nbsp;&nbsp;<span> '+combo+' Combo</span>');
	};
	//setTimer 객체들
	var setTimerArray = [];

	//게임 오버에서 홈으로 버튼 핸들러
	$('#finish_message .home').click(function(){
		$('.page-locater[ref="play"]').trigger('click');
		$(".main_audio").trigger('pause');
		$('#rank-scroll').show();
	});

	return {

		readyGo : function(callback){	//레디고 출력

			$('.page').hide();
		    $('#page_games').show();
		    $('#rank-scroll').hide();
		    $("#finish_message").hide();
		    
		    setTimerArray.push(setTimeout(function(){
		    	$("#start_message").html("<img src='assets/img/game/img_ready.png'></img>");
		    	
		    	setTimerArray.push(setTimeout(function(){
		    		$("#start_message").html("<img src='assets/img/game/img_go.png'></img>");
		    		
		    		setTimerArray.push(setTimeout(function(){
		        		$("#start_message").empty();
						$('.game-info-header').show();

		        		game.runTimer();
		        		callback && callback();

		        	}, 1000));
		    		
		    	}, 1500));
		    	
		    }, 500));
		},
		runTimer : function(){ //타이머 출력
			
			var duration = 1000 * limitSec;
			
			elem.progess.stop().width(0).animate({
				width: '600px',
			}, {
				duration: duration,
				specialEasing :{
					width: 'linear'
				},
				step: function(now, fx){
					currentTime = Math.round((now * duration) / 600);
					var nRemainTime =  parseInt(currentTime/1000);
					var curSec = limitSec - nRemainTime;
					elem.timer.text(curSec);
					//_elem.current.text(nRemainTime.toString());
				},
				complete: function(){
					//게임이 끝나고 할 액션 정보
					console.log('complete!!');
					setTimeout(function(){
						$(".game-info-header").hide();
						$(".play-ground").hide();
						$("#game_title").hide();

		        		$("#finish_message").show();
		        		$("#finish_message").find('.point').text(point+' Point');
		        		$("#finish_message").find('.combo').text(combo+' Combo');

		        		$(".main_audio").trigger('pause');	
						var ending = "assets/sound/BT_ending.mp3";
						main_audio = $('#main_audio').attr("src",ending)[0];
						main_audio = $('#main_audio').attr("loop",true)[0];       
						
		        	}, 100);
					
					var id =  window.sessionStorage.id  || '';
					var json = {"GAMETYPE":type, "ID":id, "SCORE":point, "MAXCOMBO":combo};
					
					$.ajax({
						url		:	"jsp/putscore.jsp",
						type	:	"POST",	
						data	:	json,
						datatype:	"json",
						
						success	: function(result){
							//alert(result);
						},
						error	: function(){
							console.log('error from post');
						},
						complete: function(){
						}
					});
				}

			});
		},
		solve : function(isCorrect){
			if(isCorrect){
				point = point + acqPoint;
				combo++;
			}else{
				point = point - acqPoint;
				combo=0;
			}
			sycPoint();
		},
		clearGame : function(){
			combo = 0;
			point = 0;
			sycPoint();

			elem.gameHeader.hide();
			elem.progess.stop().width(0);
			elem.timer.text(10);
			$(".game-info-header").hide();
			$(".play-ground").hide();
			$.each(setTimerArray, function(idx, item){
				clearTimeout(item);
			});
		},
		getScore : function(){
			return point;
		},
		getCombo : function(){
			return combo;
		},
		setType : function(gameType){
			type = gameType;
		}
	};
}();


//숫자 대소비교 게임 인스턴스
var game1 = function(){

	var _this = $('#game_g1');

	var elem = {
		question : 	_this.find('.question'),
		leftNum :  	_this.find('.left-num'),
		rightNum :  _this.find('.right-num'),
		option : 	_this.find('.option'),
		title : 	$('#game_title')
	};

	var currentQNum = {
		left : 0,
		right : 0
	};

	var getRanNum = function(size){
		var length = 1;
		while(size)
		{
			length = length * 10;
			size--;
			if(size == 0)
			{
				break;
			}
		}		
		return Math.floor(Math.random()*length);
	};

	//정답 제출 핸들러
	elem.option.find('> div').click(function(){
		var largeT = $(this).attr('largeT');
		game1.submit(largeT);
	});

	//제출함수 로 부터 UI 처리
	var	processSumbit = function(bool){
		if(bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_o.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(true);
			game1.playSet();

		}
		else if(!bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_x.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(false);
			game1.playSet();
		}
	};
	
	return{
		init : function(){
			_this.show();
			$("#game_title").show();
			elem.title.text('숫자대소비교');
			game1.playSet();
			game.setType(1);

			//키보드 핸들링
			$(window).on('keyup', function(e){
				switch(e.keyCode){
					case 37 :
						elem.option.find('> div').eq(0).trigger('click');
						break;
					case 40 :
						elem.option.find('> div').eq(1).trigger('click');
						break;
					case 39 :
						elem.option.find('> div').eq(2).trigger('click');
						break;
				}
			})
		},
		playSet : function(){
			elem.question.hide();

			currentQNum.left = getRanNum(2);
			currentQNum.right = getRanNum(2); 

			elem.leftNum.text(currentQNum.left);
			elem.rightNum.text(currentQNum.right);
			elem.question.fadeIn(350);
		},
		submit : function(largeT){

			switch (largeT){
				case 'left' :
					if(currentQNum.left > currentQNum.right){
						processSumbit(true);
					}else{
						processSumbit(false);
					}
				break;
				case 'right' :
					if(currentQNum.left < currentQNum.right){
						processSumbit(true);
					}else{
						processSumbit(false);
					}

				break;
				case 'equal' :

					if(currentQNum.left == currentQNum.right){
						processSumbit(true);
					}else{
						processSumbit(false);
					}

				break;
			}
		}
	};
}();

//사진숫자세기 게임 인스턴스
var game2 = function(){

	var _this = $('#game_g2');

	var elem = {
		picture : 	_this.find('.picture'),
		option : 	_this.find('.option'),
		num1 :  	_this.find('.num1'),
		num2 :  	_this.find('.num2'),
		num3 :  	_this.find('.num3'),
		num4 :  	_this.find('.num4'),
		title : 	$('#game_title')
	};

	var level = 1;
	var currentPicMeta = {};
	var example = {}


	//제출함수 로 부터 UI 처리
	var	processSumbit = function(bool){
		if(bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_o.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(true);
			game2.playSet();

		}
		else if(!bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_x.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(false);
			game2.playSet();
		}
	};

		/*이 함수에 레벨을 정수로 입력하면 해당 레벨의 문제가 랜덤으로 반환됩니다.
	 * 콘솔 창에 반환된 JSON과 레벨이 표시됩니다.
	 * 입력 : 정수
	 * 출력 : JSON 배열
	 */
	var getRanPicMeta = function(input_level){
		var random_number;
		switch(input_level)
		{
			case 1:
				console.log("레벨1 문제를 랜덤으로 가져옵니다.");
				random_number = Math.floor(Math.random() * picture.level_1.length);
				// 랜덤숫자를 만들지만 최대 숫자가 해당 레벨의 최대 배열을 못넘습니다.
				console.log(picture.level_1[random_number]);
				return picture.level_1[random_number];
				break;
			
			case 2:
				console.log("레벨2 문제를 랜덤으로 가져옵니다.");
				random_number = Math.floor(Math.random() * picture.level_2.length);
				// 랜덤숫자를 만들지만 최대 숫자가 해당 레벨의 최대 배열을 못넘습니다.
				console.log(picture.level_2[random_number]);
				return picture.level_2[random_number];
				break;
				
			case 3:
				console.log("레벨3 문제를 랜덤으로 가져옵니다.");
				random_number = Math.floor(Math.random() * picture.level_3.length);
				// 랜덤숫자를 만들지만 최대 숫자가 해당 레벨의 최대 배열을 못넘습니다.
				console.log(picture.level_3[random_number]);
				return picture.level_3[random_number];
				break;
				
			case 4:
				console.log("레벨4 문제를 랜덤으로 가져옵니다.");
				random_number = Math.floor(Math.random() * picture.level_4.length);
				// 랜덤숫자를 만들지만 최대 숫자가 해당 레벨의 최대 배열을 못넘습니다.
				console.log(picture.level_4[random_number]);
				return picture.level_4[random_number];
				break;
				
			case 5:
				console.log("레벨5 문제를 랜덤으로 가져옵니다.");
				random_number = Math.floor(Math.random() * picture.level_5.length);
				// 랜덤숫자를 만들지만 최대 숫자가 해당 레벨의 최대 배열을 못넘습니다.
				console.log(picture.level_5[random_number]);
				return picture.level_5[random_number];
				break;
				
			default :
				console.log("예외 : random_picture 함수에는 1~5만 입력가능합니다.");
				return -1;
		}
	}

	var getExample = function(nCorrectAnswer) {
		var nStart = Math.max(nCorrectAnswer-2 , 0);
		var aPool = _.range(nStart, nCorrectAnswer+2);
		aPool = aPool.remove(nCorrectAnswer);

		var aExamples = _.flatten([_.sample(aPool, 4), nCorrectAnswer]);
		
		return _.shuffle(aExamples);
	};

	var upgradeLevel = function(){
		if(game.getScore() == 4000){
			level = 1;
		}else if(game.getScore() == 7000){
			level = 2;
		}else if(game.getScore() == 12000){
			level = 3;
		}else if(game.getScore() == 16000){
			level = 4;
		}
	};

	//정답 제출 핸들러
	elem.option.find('> div').click(function(){
		var submitVal = $(this).text();
		game2.submit(submitVal);
	});
	
	return{
		init : function(){
			_this.show();
			$("#game_title").show();
			elem.title.text('사진숫자퀴즈');
			game2.playSet();
			game.setType(2);

			//키보드 핸들링
			$(window).on('keyup', function(e){
				switch(e.keyCode){
					case 38 :
						elem.option.find('> div').eq(0).trigger('click');
						break;
					case 39 :
						elem.option.find('> div').eq(1).trigger('click');
						break;
					case 40 :
						elem.option.find('> div').eq(2).trigger('click');
						break;
					case 37 :
						elem.option.find('> div').eq(3).trigger('click');
						break;
				}
			})
		},
		playSet : function(){
			elem.picture.hide();
			elem.option.find('> div').hide();

			upgradeLevel();

			currentPicMeta = getRanPicMeta(level);
			var exampleArray = getExample(currentPicMeta.ANSWER);

			$.each(exampleArray, function(idx, item){
				elem.option.find('> div').eq(idx).text(item).fadeIn(200);
			})

			elem.picture.css('background-image', 'url(assets/game/'+level+'/'+currentPicMeta.URL+')');
			elem.picture.fadeIn(350);
		},
		submit : function(submitVal){
			if(submitVal == currentPicMeta.ANSWER){
				processSumbit(true);
			}else{
				processSumbit(false);
			}
		}
	};
}();

//색깔순서 맞추기 게임 인스턴스
var game3 = function(){

	var _this = $('#game_g3');

	var elem = {
		color_area : _this.find('.color_area'),
		color_1 : 	_this.find('.color_1'),
		color_2 : 	_this.find('.color_2'),
		color_3 : 	_this.find('.color_3'),
		color_4 : 	_this.find('.color_4'),
		color_5 : 	_this.find('.color_5'),
		selected_color_1 : 	_this.find('.selected_color_1'),
		selected_color_2 : 	_this.find('.selected_color_2'),
		selected_color_3 : 	_this.find('.selected_color_3'),
		selected_color_4 : 	_this.find('.selected_color_4'),
		selected_color_5 : 	_this.find('.selected_color_5'),
		option_area : _this.find('.option_area'),
		color_option_1 : 	_this.find('.color_option_1'),
		color_option_2 : 	_this.find('.color_option_2'),
		color_option_3 : 	_this.find('.color_option_3'),
		color_option_4 : 	_this.find('.color_option_4'),
		color_option_5 : 	_this.find('.color_option_5'),
		color_option_6 : 	_this.find('.color_option_6'),
		color_option_7 : 	_this.find('.color_option_7'),
		color_option_8 : 	_this.find('.color_option_8'),
		title : 	$('#game_title'),
		
		//picture : 	_this.find('.picture'),
		//option : 	_this.find('.option'),
		//num1 :  	_this.find('.num1'),
		//num2 :  	_this.find('.num2'),
		//num3 :  	_this.find('.num3'),
		//num4 :  	_this.find('.num4')
	};
	
	//var currentLevel = 1;	// 현재 레벨 입니다.
	
	var maxLevel = 1;	// 최대 레벨 입니다.
	
	var currentPosition = 1; // 색을 골랐을 때 색이 들어가야할 곳의 위치입니다.
	
	var getRandomNumberByRange = function(min, max) {	// 범위로 랜덤 변수를 반환합니다.
			return Math.floor( (Math.random() * (max - min + 1)) + min );
	};
	
	var controlLevel = function(){	// 레벨을 조정합니다!
		if(game.getScore() <= 2000){
			maxLevel = 1;
		}else if(game.getScore() <= 5000){
			maxLevel = 2;
		}else if(game.getScore() <= 8000){
			maxLevel = 3;
		}else if(game.getScore() <= 12000){
			maxLevel = 4;
		}else if(game.getScore() <= 15000){
			maxLevel = 5;
		}
	};
	
	
	var setColor = function(){
		if(currentPosition<5)
		{
			console.log("객체지향 성공.");
		}
			
	};
	
	//정답 제출 핸들러
	elem.option_area.children("div").click(function(){
		var color = $(this).css("background-color");
		$(".selected_color_" + currentPosition).css("background-color", color);
		game3.submit(color);	
	});
	
	//제출함수 로 부터 UI 처리
	var	processSumbit = function(bool){
		if(bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_o.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(true);
			game3.playSet();

		}
		else if(!bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_x.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(false);
			game3.playSet();
		}
	};
	
	return{
		init : function(){
			_this.show();
			$("#game_title").show();
			maxLevel = 1;
			elem.title.text('색깔 순서 맞추기');
			elem.color_area.children("div").css("background-color", "transparent"); // 선택지와 문제를 초기화하자!
			game3.playSet();
			game.setType(3);

			$(window).on('keyup', function(e){
				switch(e.keyCode){
					case 81 :
						console.log(0);
						elem.option_area.children("div").eq(0).trigger('click');
						break;
					case 87 :
					console.log(1);
						elem.option_area.children("div").eq(1).trigger('click');
						break;
					case 69 :
					console.log(2);
						elem.option_area.children("div").eq(2).trigger('click');
						break;
					case 82 :
					console.log(3);
						elem.option_area.children("div").eq(3).trigger('click');
						break;
					case 65 :
					console.log(4);
						elem.option_area.children("div").eq(4).trigger('click');
						break;
					case 83 :
					console.log(5);
						elem.option_area.children("div").eq(5).trigger('click');
						break;
					case 68 :
					console.log(6);
						elem.option_area.children("div").eq(6).trigger('click');
						break;
					case 70 :
					console.log(7);
						elem.option_area.children("div").eq(7).trigger('click');
						break;	
				}
			});
		},
		playSet : function(){
			var randomColor=0;
			for(var start = 1; start<=maxLevel; start++){
				randomColor = getRandomNumberByRange(1, 8);
				// 아래에 있는 보기중에서 랜덤으로 색을 가져옵니다.
				$(".color_" + start).css("background-color", $(".color_option_" + randomColor).css("background-color"));
			}
		},
		submit : function(color){
			console.log("답을 골랐습니다..");
			var answer =  $(".color_" + currentPosition).css("background-color");
			if(color==answer) // 지금 찍은게 맞았으면 
			{
				console.log("맞았어!");
				if(currentPosition == maxLevel) // 마지막 선택지 였을 경우
				{
					controlLevel();	// 레벨을 조절합니다!
					console.log("다 맞았어!");
					elem.color_area.children("div").css("background-color", "transparent"); // 선택지와 문제를 초기화하자!
					currentPosition = 1;
					processSumbit(true);
				}
				else	// 마지막 선택지가 아니었으면!
				{
					// 다음 선택지를 골라줍니다.
					currentPosition = currentPosition + 1;
				}
			}
			if(color!=answer) // 지금 찍은게 틀렸으면
			{
				controlLevel();	// 레벨을 조절합니다!
				//elem.color_area.children("div:lt(4)").css("background-color", "transparent"); // 문제지를 초기화하자!
				elem.color_area.children("div").css("background-color", "transparent"); // 선택지와 문제를 초기화하자!
				console.log("틀렸어!");
				processSumbit(false);
				currentPosition = 1;	// 선택지 위치를 다시 1번으로 돌리고
			}
			
			console.log(currentPosition);
		}
	};
}();

//짝 없는 그림찾기 게임 인스턴스
var game4 = function(){

	var _this = $('#game_g4');

	var elem = {
		picture_area : 	_this.find('.game4_picture_area'),
		pic1 : 	_this.find('.game4_picture_1'),
		pic2 : 	_this.find('.game4_picture_2'),
		pic3 : 	_this.find('.game4_picture_3'),
		pic4 : 	_this.find('.game4_picture_4'),
		pic5 : 	_this.find('.game4_picture_5'),
		pic6 : 	_this.find('.game4_picture_6'),
		pic7 : 	_this.find('.game4_picture_7'),
		pic8 : 	_this.find('.game4_picture_8'),
		pic9 : 	_this.find('.game4_picture_9'),
		pic10 : 	_this.find('.game4_picture_10'),
		pic11 : 	_this.find('.game4_picture_11'),
		pic12 : 	_this.find('.game4_picture_12'),
		pic13 : 	_this.find('.game4_picture_13'),
		pic14 : 	_this.find('.game4_picture_14'),
		pic15 : 	_this.find('.game4_picture_15'),
		pic16 : 	_this.find('.game4_picture_16'),
		pic17 : 	_this.find('.game4_picture_17'),
		pic18 : 	_this.find('.game4_picture_18'),
		pic19 : 	_this.find('.game4_picture_19'),
		pic20 : 	_this.find('.game4_picture_20'),
		pic21 : 	_this.find('.game4_picture_21'),
		pic22 : 	_this.find('.game4_picture_22'),
		pic23 : 	_this.find('.game4_picture_23'),
		pic24 : 	_this.find('.game4_picture_24'),
		pic25 : 	_this.find('.game4_picture_25'),
		title : 	$('#game_title')
	};

	var currentLevel = 1;	// 현재 레벨 입니다.
	
	var minimum = 0;	// 최소 범위 입니다.
	var maximum = 0;	// 최대 범위 입니다.
	var answer_number = 0; // 정답을 저장하는 변수 입니다.
	
	var getRandomNumberByRange = function(min, max) {	// 범위로 랜덤 변수를 반환합니다.
			return Math.floor( (Math.random() * (max - min + 1)) + min );
	};
	
	var getRandomNumberByRangeNorepeat = function(min,max){	// 반복없이 범위로 랜덤 배열을 반환합니다.
	    var A= [];
	    while(max>= min) A.push(max--)    
	    A.sort(function(){return .5- Math.random()});  
	    return A;
	}
	
	var controlLevel = function(){	// 레벨을 조정합니다!
		if(game.getScore() <= 4000){
			currentLevel = 1;
		}else if(game.getScore() <= 10000){
			currentLevel = 2;
		}else if(game.getScore() <= 15000){
			currentLevel = 3;
		}else if(game.getScore() <= 21000){
			currentLevel = 4;
		}else if(game.getScore() <= 28000){
			currentLevel = 5;
		}
	};
	
	/*
	var setColor = function(){
		if(currentPosition<5)
		{
			console.log("객체지향 성공.");
		}
			
	};*/
	
	//정답 제출 핸들러
	elem.picture_area.find("td").click(function(){
		var name = $(this).attr("class");
		name = name.replace('game4_picture_', '');
		console.log(name);
		console.log(answer_number);
		game4.submit(name, answer_number);	
	});
	
	//제출함수 로 부터 UI 처리
	var	processSumbit = function(bool){
		if(bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_o.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(true);
			controlLevel();	// 레벨을 조절합니다!
			game4.playSet();

		}
		else if(!bool){
			$("#result_message").html("<img src='assets/img/game/img_feedback_x.png'></img>").show();
			$("#result_message").fadeOut(500);
			game.solve(false);
			controlLevel();	// 레벨을 조절합니다!
			game4.playSet();
		}
	};
	
	return{
		init : function(){
			_this.show();
			$("#game_title").show();
			elem.title.text('짝 없는 그림 찾기');
			$(".game4_table").find("td").css("background", "transparent");
			currentLevel = 1;
			game4.playSet();
			game.setType(4);
		},
		playSet : function(){
			var randomPicture = getRandomNumberByRangeNorepeat(1, 115);	// 랜덤으로 그림 115개 순서를 섞습니다.
			switch(currentLevel)
			{
				case 1:	// 레벨 1인 경우
					minimum = 11;	// minimum과 maximum은 홀수여야 합니다.
					maximum = 15;
					break;

				case 2:	// 레벨 2인 경우
					minimum = 9;
					maximum = 17;
					break;
				
				case 3:	// 레벨 3인 경우
					minimum = 7;
					maximum = 19;
					break;
				
				case 4:	// 레벨 4인 경우
					minimum = 5;
					maximum = 21;
					break;
				
				case 5:	// 레벨 5인 경우
					minimum = 3;
					maximum = 23;
					break;
				
				default:
			}
			// 먼저 하나만 놓을 자리를 랜덤으로 정합니다.
			var solo_image_position = getRandomNumberByRange(minimum , maximum);
			// 11번방 부터 15번 방까지 랜덤 순서로 만듭니다.
			var random_room = getRandomNumberByRangeNorepeat(minimum , maximum);
			// 역 리스트를 만듭니다.
			var random_number = Array(maximum+1);					
			// 방 5개를 순회하면서 방 번호를 체크 합니다.
			var smallest_number = minimum;
			for(var num=0; num<(maximum-minimum+1); num++)
			{
				console.log("방 순회"+num);
				for(var num2=0; num2<(maximum-minimum+1); num2++)
				{
					console.log("다음 방 순회"+num2);
					if(random_room[num2] == smallest_number)	// 제일 낮은 수인지 확인하고
					{
						console.log("제일 낮은 수 찾음"+smallest_number);
						random_number[smallest_number] = num2;	// 랜덤 변수가 들어간 방의 번호가 저장됩니다. [랜덤변수]=방번호
						smallest_number ++;
						break;
					}
					
				}
				
			}
			for(var num=minimum; num<(maximum+1); num++)
			{
				// 11번이 들어있는 방에는 제일 첫번째 랜덤 그림을 넣습니다.
				if(num==minimum)
				{
					answer_number = random_number[num]+minimum;
					$(".game4_picture_" + (random_number[num]+minimum)).css({"background": "url(./assets/game4/" + randomPicture[0] + ".png)", "background-size": "cover"});
					$(".game4_picture_" + (random_number[num]+minimum)).css("background-color", "yellow");
				}
				else	// 다른 방에는 같은 그림을 두번씩 집어넣습니다.
				{
					// X번 방에는 X번 랜덤 그림을 넣는다.
					$(".game4_picture_" + (random_number[num]+minimum)).css({"background": "url(./assets/game4/" + randomPicture[Math.floor(num/2)*2] + ".png)", "background-size": "cover"});
				}
			}
		},
		submit : function(selected_answer, answer){
			console.log("답을 골랐습니다..");
			if(selected_answer==answer)
			{
				processSumbit(true);
			}
			else
			{

				processSumbit(false);
			}
			//alert(getRandomNumberByRangeNorepeat(1, 5));
			/*
			var answer =  $(".color_" + currentPosition).css("background-color");
			if(color==answer) // 지금 찍은게 맞았으면 
			{
				console.log("맞았어!");
				if(currentPosition == maxLevel) // 마지막 선택지 였을 경우
				{
					controlLevel();	// 레벨을 조절합니다!
					console.log("다 맞았어!");
					elem.color_area.children("div").css("background-color", "transparent"); // 선택지와 문제를 초기화하자!
					currentPosition = 1;
					processSumbit(true);
				}
				else	// 마지막 선택지가 아니었으면!
				{
					// 다음 선택지를 골라줍니다.
					currentPosition = currentPosition + 1;
				}
			}
			if(color!=answer) // 지금 찍은게 틀렸으면
			{
				controlLevel();	// 레벨을 조절합니다!
				//elem.color_area.children("div:lt(4)").css("background-color", "transparent"); // 문제지를 초기화하자!
				elem.color_area.children("div").css("background-color", "transparent"); // 선택지와 문제를 초기화하자!
				console.log("틀렸어!");
				processSumbit(false);
				currentPosition = 1;	// 선택지 위치를 다시 1번으로 돌리고
			}
			
			console.log(currentPosition);*/
		}
	};
}();
