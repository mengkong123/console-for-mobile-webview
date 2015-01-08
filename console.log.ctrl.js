javascript:!function(b){!
	function(Ajs) {
		var oScript = document.createElement("script");
		oScript.src = Ajs.shift();
		oScript.charset = 'utf-8';
		b.appendChild(oScript);
		console.log("正在加载：" + oScript.src);
		Ajs.length && (oScript.onload = arguments.callee.bind(null, Ajs));
		Ajs.length == 0 && (oScript.onload = function() {
			var textarea = $('<textarea id="yuan_mobile_console">');
			var first_line = '> ------ from Yuanoook.com ------ \n> ';

			textarea.css({
				position: 'fixed',
				left: 0,
				border: 0,
				outline: 'none',
				background: 'black',
				color: 'white',
				zIndex: 100000000000
			});

			textarea.big = function(){
				return textarea.css({
					top: 0,
					width: '100%',
					height: '100%'
				});
			};

			textarea.small = function(){
				return textarea.css({
					top: '40%',
					width: '30%',
					height: '50px'
				});
			};

			textarea.big();

			textarea.val( first_line ).appendTo($('body')).on('keyup',function(event) {
				if(event.keyCode != 13 && event.keyCode != 8) return;

				var textarea_text = textarea.val();
				var lines = textarea_text.split(/\n/);
				var act_line = null;
				var command = null;
				var result = null;
				var line_count,line_param,line_start,line_start;
				var startTime = new Date();

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
						textarea.val( first_line );
						return;
					}else if(command == ';'){
						textarea.small().val( textarea.val().replace(/;\n$/,'') );
						return;
					}else if(command == ';;'){
						textarea.big().val( textarea.val().replace(/;;\n$/,'') );
						return;
					}

					//计数参数设置，能够返回你指定范围内的数据
					line_count = 0;
					line_param = command.match( /\s(\d*)\s(\d*)$/ ) || [0,0,0];
					line_start = parseInt( line_param[1] )-1;
					line_stop = parseInt( line_param[2] ) || (command.match( /\s(\d*)$/g ) ? parseInt(command.match( /\s(\d*)$/g )[0]) : 0);
					command = command.replace(/\s(\d*)\s(\d*)$|\s(\d*)$/,'');

					// console.log([line_count,line_start,line_stop,command]);

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
							result = ( function(command, context, parents){
								var thisFunction = arguments.callee;
								var text = '';
								var obj = line_count==0 ? eval.call(context, command) : command;
								var isVisited = false;
								var fullname = '';

								line_count == 0 && (thisFunction.historyArguments = []);
								thisFunction.historyArguments.push(obj);

								if(obj && (typeof obj == 'object')){
									line_count !=0 && (text += '\n< ');
									for(i in obj){

										if (thisFunction.historyArguments.indexOf(obj[i]) != -1){
 											isVisited = true;
										}

										fullname =  (parents!=''?parents+'.':'') + i ;

										(!line_stop || (line_count >= line_start)) && ( text += ( fullname + ': ' + ( isVisited ? obj[i] : thisFunction(obj[i], obj, fullname) ) + '\n< ' ) );
										line_count++;
										if(line_stop && line_count >= line_stop) return text.replace(/\n<\s$/,'');
									} 
									return text.replace(/\n<\s$/,'');
								} 
								return obj;
							}(command, window, '') );
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
					lines[lines.length] = '< ------ spend: '+(new Date()-startTime)+'ms ------';
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
