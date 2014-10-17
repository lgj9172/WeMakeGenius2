$(function bgm() {
	var main	 = "assets/sound/BT_main.mp3";
	var ready_go = "assets/sound/ready.mp3";
	var game	 = "assets/sound/BT_play.mp3";
	var game_home= "assets/sound/game.mp3";
	audio_event = document.getElementById("main_audio");
	
	$('#game_play_home').click(function(){
		if(window.sessionStorage.length == 0){
			return false;
		}
		else{
			$(".main_audio").trigger('pause');
			
			main_audio = $('#main_audio').attr("src", game_home)[0];
			main_audio = $('#main_audio').attr("loop",true)[0];
		}
	});
	//게임 실행시 나오는 ready~go~!통제
	//숫자비교게임
	$('#number_compare').click(function(){
		$(".main_audio").trigger('pause');	
		
		//main_audio.prop("currentTime",main_audio.prop("currentTime")+5);
		main_audio = $('#main_audio').attr("src",ready_go)[0];
		main_audio = $('#main_audio').attr("loop",false)[0];
		
		$("#main_audio").bind("ended", function(){
			main_audio = $('#main_audio').attr("src",game)[0];
			main_audio = $('#main_audio').attr("loop",true)[0];       
		});
	});
	//사진 숫자 맞추기 게임
	$('#count_number').click(function(){
		$(".main_audio").trigger('pause');
		
		//main_audio.prop("currentTime",main_audio.prop("currentTime")+5);
		main_audio = $('#main_audio').attr("src",ready_go)[0];
		main_audio = $('#main_audio').attr("loop",false)[0];
		
		$("#main_audio").bind("ended", function(){
			main_audio = $('#main_audio').attr("src",game)[0];
			main_audio = $('#main_audio').attr("loop",true)[0];       
		});
	});
	//색깔 순서 맞추기
	$('#choose_color').click(function(){
		$(".main_audio").trigger('pause');
		
		//main_audio.prop("currentTime",main_audio.prop("currentTime")+5);
		main_audio = $('#main_audio').attr("src",ready_go)[0];
		main_audio = $('#main_audio').attr("loop",false)[0];
		
		$("#main_audio").bind("ended", function(){
			main_audio = $('#main_audio').attr("src",game)[0];
			main_audio = $('#main_audio').attr("loop",true)[0];       
		});
	});
	//짝 없는 그림 찾기
	$('#choose_alone_picture').click(function(){
		$(".main_audio").trigger('pause');
		
		//main_audio.prop("currentTime",main_audio.prop("currentTime")+5);
		main_audio = $('#main_audio').attr("src",ready_go)[0];
		main_audio = $('#main_audio').attr("loop",false)[0];
		
		$("#main_audio").bind("ended", function(){
			main_audio = $('#main_audio').attr("src",game)[0];
			main_audio = $('#main_audio').attr("loop",true)[0];       
		});
	});
	
	//통계화면으로 돌아갈때
});