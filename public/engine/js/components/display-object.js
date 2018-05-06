PIXI.DisplayObject.prototype.getGlobalRotation = function getGlobalRotation() {
	var ret = this.rotation;
	var p = this.parent;
	while (p) {
		ret += p.rotation;
		p = p.parent;
	}
	return ret;
}

PIXI.DisplayObject.prototype.detachFromParent = function () {
	if(this.parent) {
		this.parent.removeChild(this);
	}
}

PIXI.DisplayObject.prototype.onRemove = () => {};

PIXI.DisplayObject.prototype.remove = function () {
	Lib.destroyObjectAndChildrens(this);
}

export default PIXI.DisplayObject;


//EDITOR

Object.defineProperties(PIXI.DisplayObject.prototype, {
	'scale.x': {
		get: function () {
			return this.transform.scale.x
		},
		set: function (val) {
			this.transform.scale.x = val
		}, configurable: true
	}, 'scale.y': {
		get: function () {
			return this.transform.scale.y
		},
		set: function (val) {
			this.transform.scale.y = val
		}, configurable: true
	},
	'skew.x': {
		get: function () {
			return this.transform.skew.x
		},
		set: function (val) {
			this.transform.skew.x = val
		}, configurable: true
	}, 'skew.y': {
		get: function () {
			return this.transform.skew.y
		},
		set: function (val) {
			this.transform.skew.y = val
		}, configurable: true
	},
	'pivot.x': {
		get: function () {
			return this.transform.pivot.x
		},
		set: function (val) {
			this.transform.pivot.x = val
		}, configurable: true
	}, 'pivot.y': {
		get: function () {
			return this.transform.pivot.y
		},
		set: function (val) {
			this.transform.pivot.y = val
		}, configurable: true
	}
});

PIXI.DisplayObject.EDITOR_editableProps = [
	{
		type: 'splitter',
		title: 'Basic props:',
		name: 'basic'
	},
	{
		name: 'name',
		type: String
	},
	{
		name: 'x',
		type: Number
	},
	{
		name: 'y',
		type: Number
	},
	{
		name: 'rotation',
		type: Number,
		step: 0.001
	},
	{
		name: 'alpha',
		type: Number,
		step: 0.01,
		min: 0,
		max: 1,
		default: 1
	},
	{
		name: 'visible',
		type: Boolean,
		default: true
	},
	{
		type: 'splitter',
		title: 'Transform:',
		name: 'transform'
	},
	{
		name: 'scale.x',
		type: Number,
		step: 0.01,
		default: 1
	},
	{
		name: 'scale.y',
		type: Number,
		step: 0.01,
		default: 1
	},
	{
		name: 'skew.x',
		type: Number,
		step: 0.01
	},
	{
		name: 'skew.y',
		type: Number,
		step: 0.01
	},
	{
		name: 'pivot.x',
		type: Number
	},
	{
		name: 'pivot.y',
		type: Number
	}
];

wrapPropertyWithNumberChecker(PIXI.ObservablePoint, 'x');
wrapPropertyWithNumberChecker(PIXI.ObservablePoint, 'y');

//ENDEDITOR