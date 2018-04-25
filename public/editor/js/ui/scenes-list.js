import Group from "./group.js";

var classViewProps = {className: 'vertical-layout'};
var bodyProps = {className: 'list-view', title:'Double click to open scene.'};

const sceneFileFiler = /^scenes\/.*\.scene.json$/gm;
const sceneExtRemover = /.scene.json$/gm;
const fileNameToSceneName = (fn) => {
    return fn.replace('scenes/', '').replace(sceneExtRemover, '');
}

function SelectText(element) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

var sceneNameProps = {className:"selectable-text", title:'click to select scene`s name', onMouseDown:function (ev) {
    SelectText(ev.target);
    sp(ev);
}};

const sceneNameFilter = /[^a-z\-\/0-9]/g;

export default class ScenesList extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {};
		this.onSelect = this.onSelect.bind(this);
	}
	
	onSaveSceneClick() {
		EDITOR.saveCurrentScene(EDITOR.projectDesc.currentSceneName);
	}
    
    onSaveAsSceneClick() {
		
	    var defaultSceneName = EDITOR.projectDesc.currentSceneName.split('/');
        defaultSceneName.pop();
        defaultSceneName = defaultSceneName.join('/');
	    if(defaultSceneName) {
	        defaultSceneName += '/';
        }
        EDITOR.ui.modal.promptShow('Enter name for scene:',
            defaultSceneName,
            (val) => { // filter
                return val.toLowerCase().replace(sceneNameFilter, '');
            },
            (val) => { //accept
                if(Lib.scenes.hasOwnProperty(val)) {
                    return "Name already exists";
                }
                if(val.endsWith('/') || val.startsWith('/')) {
                    return 'name can not begin or end with "/"';
                }

            }).then((enteredName) => {
                EDITOR.saveCurrentScene(enteredName);
            });
	}
    
    onSelect(item) {
		
	}
	
	renderItem(sceneName, item) {
        var cls = Lib.getClass(item.c);
		return R.div({onDoubleClick: () => {
                EDITOR.ui.viewport.stopExecution();
		        EDITOR.loadScene(sceneName);
            },
            key:sceneName
        }, R.listItem(R.span(null, R.classIcon(cls), R.b(sceneNameProps, sceneName), ' (' + cls.name + ')'), item, sceneName, this));
	}
	
	render () {
		var libsScenes = Lib._getAllScenes();
		var currentSceneName = EDITOR.projectDesc && EDITOR.projectDesc.currentSceneName;
		
		var bottomPanelClassName = '';
		if (!currentSceneName) {
			bottomPanelClassName += ' disabled';
			this.state.selectedItem = null;
		} else {
            this.state.selectedItem = libsScenes[currentSceneName];
		}
				
        var scenes = [];
        for(var sceneName in libsScenes) {
            if(!ScenesList.isSpecialSceneName(sceneName)) {
                scenes.push(this.renderItem(sceneName, libsScenes[sceneName]));
            }
        }

        scenes = Group.groupArray(scenes);

		return R.div(classViewProps,
			R.div({className: bottomPanelClassName}, R.btn('Save', this.onSaveSceneClick, 'Save current scene'), R.btn('Save As...', this.onSaveAsSceneClick, 'Save current scene under new name.')),
			R.div(bodyProps, scenes)
		)
	}
	
	static readAllScenesList() {
	    var scenes = {};
	    return Promise.all(
            EDITOR.fs.files.filter(fn => fn.match(sceneFileFiler))
            .map((fn) => {
                return EDITOR.fs.openFile(fn)
                .then((data) => {
                    scenes[fileNameToSceneName(fn)] = data;
                });
            })
        ).then(() => {
	        Lib._setScenes(scenes)
        });
    }
	
	static isSpecialSceneName(sceneName) {
	    return sceneName.indexOf(EDITOR.editorFilesPrefix) === 0;
    }
}
