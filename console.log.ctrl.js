javascript:!function(b){!
	function(Ajs) {
		var oScript = document.createElement("script");
		oScript.src = Ajs.shift();
		oScript.charset = 'utf-8';
		b.appendChild(oScript);
		console.log("正在加载：" + oScript.src);
		Ajs.length && (oScript.onload = arguments.callee.bind(null, Ajs));
		Ajs.length == 0 && (oScript.onload = function() {
			$('<textarea>').css({
				position: 'fixed',
				top: '50px',
				width: $(window).width(),
				height: '700px',
				border: 0,
				background: 'black',
				color: 'white',
				zIndex: 100000000000
			}).html('> Yuan.Console.js was created by yuanoook.com \n> ').appendTo($('body')).on('keyup',function(event) {
				if(event.keyCode != 13 && event.keyCode != 8) return;

				var textarea = $(this);
				var textarea_text = textarea.val();
				var lines = textarea_text.split(/\n/);
				var act_line = null;
				var command = null;
				var result = null;
				var line_count,line_param,line_start,line_start;

				if(event.keyCode == 13){
					act_line = function(){
						var i = lines.length;
						while(i-- > 0){
							if( !/^>\s|^<\s/.test(lines[i]) ) return i;
						}
					}();

					command = lines[act_line-1].replace(/^>\s|<\s/,'') + lines[act_line];
					if(command == ''){
						lines.splice(act_line,1);
						textarea.val( lines.join('\n') );
						return;
					}else if(command == 'c'){
						textarea.val('> Yuan.Console.js was created by yuanoook.com \n> ');
						return;
					}

					//计数参数设置，能够返回你指定范围内的数据
					line_count = 0;
					line_param = command.match( /\s(\d*)\s(\d*)$/ ) || [0,0,0];
					line_start = parseInt( line_param[1] )-1;
					line_stop = parseInt( line_param[2] ) || (command.match( /\s(\d*)$/g ) ? parseInt(command.match( /\s(\d*)$/g )[0]) : 0);
					command = command.replace(/\s(\d*)\s(\d*)$|\s(\d*)$/,'');

					console.log([line_count,line_start,line_stop,command]);

					try{
						if( /^l\s/.test(command) ){
							command = command.replace(/^l\s/,'');
							result = ( function(command){
								var text = '';
								var obj = eval.call(window,command);
								if(obj && (typeof obj == 'object')){
									for(i in obj){
										(!line_stop || (line_count >= line_start)) && ( text += (  i + ': ' + obj[i] + '\n< ' ) );
										line_count++;
										if(line_stop && line_count >= line_stop) return text.replace(/\n<\s$/,'');
									}
									return text.replace(/\n<\s$/,'');
								} 
								return obj;
							}(command) );
						}else if(  /^ls\s/.test(command) ){
							command = command.replace(/^ls\s/,'');
							result = ( function(command){
								var text = '';
								var obj = eval.call(window,command);
								if(obj && (typeof obj == 'object')){
									for(i in obj){
										(!line_stop || (line_count >= line_start)) && ( text += ( i + ': ' + arguments.callee(obj[i]) + '\n< ' ) );
										line_count++;
										if(line_stop && line_count >= line_stop) return text.replace(/\n<\s$/,'');
									} 
									return text.replace(/\n<\s$/,'');
								} 
								return obj;
							}(command) );
						}else{
							result = eval.call(window,command);
						}
					}catch(e){
						result = e;
					}

					lines[act_line-1] = lines[act_line-1] + lines[act_line];
					lines.splice(act_line,1);
					lines[lines.length-1] == '> ' && lines.splice(lines.length-1,1);

					lines[lines.length] = '< ' + result;
					lines[lines.length] = '> ';

					textarea.val( lines.join('\n') );

					textarea.scrollTop( this.scrollHeight );
				}else if(event.keyCode == 8){
					act_line = function(){
						var i = lines.length;
						while(i-- > 0){
							if( /^>$|^<$/.test(lines[i]) ) return i;
						}
						return -1;
					}();

					if( act_line == -1 ) return;
					
					lines[act_line] = lines[act_line].replace(/^>$/,'> ');
					lines[act_line] = lines[act_line].replace(/^<$/,'< ');
					textarea.val( lines.join('\n') );
				}

			});
		});
	} (["http://www.yuanoook.com/cdn/bootstrap/jquery.min.js"]);
} (document.body || document.querySelector('body'));
