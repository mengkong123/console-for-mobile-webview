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
				height: '200px',
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
					}
					try{
						if( /^l\s/.test(command) ){
							command = command.replace(/^l\s/,'');
							result = ( function(command){
								var text = '';
								var obj = eval.call(window,command);
								if(obj && (typeof obj == 'object')){
									for(i in obj) text += ( obj(i) + '\n< ' );
									return text;
								} 
								return obj;
							}(command) );
						}else if(  /^la\s/.test(command) ){
							command = command.replace(/^la\s/,'');
							result = ( function(command){
								var text = '';
								var obj = eval.call(window,command);
								if(obj && (typeof obj == 'object')){
									for(i in obj) text += ( arguments.callee(obj(i)) + '\n< ' );
									return text;
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
