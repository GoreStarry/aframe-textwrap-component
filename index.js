module.exports.component = {
	dependencies: ["draw"],
	schema: {
		text: {
			default: "Sample Text"
		},
		x: {
			default: 5
		},
		y: {
			default: 20
		},
		font: {
			default: "20px sans-serif"
		},
		color: {
			default: "#000000"
		},
		textAlign: {
			default: "start"
		},
		textBaseline: {
			default: "alphabetic"
		},
		direction: {
			default: "inherit"
		},
		width: {
			default: 256
		},
		lineHeight: {
			default: 20
		},
		strokeColor: {
			default: false
		}
	},

	/**
	 * Called once when component is attached. Generally for initial setup.
	 */
	init: function () {
		this.draw = this.el.components.draw;
		this.draw.register(this.render.bind(this));
		
	},

	/**
	 * Called when component is attached and when component data changes.
	 * Generally modifies the entity based on the data.
	 */
	update: function () {
		this.filterEscapeUrl(); //for escaping colons, semicolons, etc
		this.draw.render();
	},

	filterEscapeUrl: function () {
		var match = this.data.text.match(/^url\((.*)\)$/);
		if (match) this.data.text = match[1];
	},

	render: function () {
		var ctx = this.draw.ctx;
		var canvas = this.draw.canvas;

		if (this.data.bg) {
			ctx.fillStyle = this.data.bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

    var textRender = TextRenderGen(this.data.strokeStyle,ctx)


		ctx.fillStyle = this.data.color;
		ctx.font = this.data.font;
		ctx.textAlign = this.data.textAlign;
		ctx.textBaseline = this.data.textBaseline;
		ctx.direction = this.data.direction;
		wrapText(ctx, this.data.text, this.data.x, this.data.y, this.data.width, this.data.lineHeight);

    function TextRenderGen(strokeStyle,ctx){
      if(strokeStyle){
        return function(text,x,y){
          ctx.strokeStyle=strokeStyle;
			    ctx.strokeText(text,x,y);
          ctx.fillText(text,x,y);
        }
      }else{
        return function(text,x,y){
          ctx.fillText(text,x,y);
        }
      }
    }

		//stolen from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
		function wrapText(context, text, x, y, maxWidth, lineHeight) {

			// This regex replacement is for Chinese(or japanese) can't be break by space like English, 
			// and English should keep wrap by space properly
			var words = text.replace(/([\u4E00-\u9FCC])|((\w+)\s)/g,`$&\n`).split(/\n/);

			var line = "";
      

			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n];
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y)
					textRender(line, x, y);
					line = words[n];
					y += lineHeight;
				} else {
					line = testLine;
				}
			}
			textRender(line, x, y);
		}
	},

	/**
	 * Called when a component is removed (e.g., via removeAttribute).
	 * Generally undoes all modifications to the entity.
	 */
	remove: function () {}
};
