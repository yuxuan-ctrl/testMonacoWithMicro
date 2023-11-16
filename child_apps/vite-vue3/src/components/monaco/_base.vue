<template>
	<div class="copy-button-box" v-if="props.notCopy">
		<el-button type="primary" @click="copyFun">复制</el-button>
	</div>
	<div
		ref="editorContainer"
		class="monaco"
		:style="{ height: height + 'px' }"
	/>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw, watchEffect } from "vue";
// 引入方法一
// import * as monaco from 'monaco-editor';
//
// 引入方法二（ 这种引入方法体积小但没有鼠标悬停方法registerHoverProvider）
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution"; // typescript代码高亮&提示
// import "monaco-editor/esm/vs/language/typescript/monaco.contribution"; // 代码高亮&提示
// import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution"; // javascript代码高亮&提示
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution"; // sql&提示
import "monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js"; // 右键显示菜单
import "monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js"; // 折叠
import "monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js"; // 格式化代码
import "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js"; // 代码联想提示
import "monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js"; // 代码联想提示

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const props = defineProps({
	modelValue: {
		type: String,
		default: ""
	},
	height: {
		// 编辑器height
		type: [String, Number],
		default: 400
	},
	readonly: {
		// 是否只读
		type: Boolean,
		default: false
	},
	type: {
		// 高亮类型（javascript、curl等,javascript：自带的，curl:自定义的高亮规则）
		type: String,
		default: "sql"
	},
	notCopy: {
		type: Boolean,
		default: true
	}
});
const editorContainer = ref<any>(null);
const editor = ref<any>(null);
const data = ref(props.modelValue);

// @ts-ignore
// window.MonacoEnvironment = {
//   getWorker(_: any, label: string) {
//     if (label === 'json') {
//       return new jsonWorker()
//     }
//     if (['css', 'scss', 'less'].includes(label)) {
//       return new cssWorker()
//     }
//     if (['html', 'handlebars', 'razor'].includes(label)) {
//       return new htmlWorker()
//     }
//     if (['typescript', 'javascript'].includes(label)) {
//       return new tsWorker()
//     }
//     return new editorWorker()
//   }
// }

onMounted(() => {
	// 初始化编辑器，确保dom已经渲染
	if (props.type === "curl") {
		// 如果是curl 类型则重新定义高亮规则,否则使用自带的高亮语言
		monaco.languages.register({ id: props.type });
		monaco.languages.setMonarchTokensProvider(props.type, {
			ignoreCase: true,
			tokenizer: {
				root: [
					[/curl/, { token: "string.escape" }],
					[/-X|-H|-d/, { token: "keyword" }],
					[
						/POST|GET|DELETE|PATCH|PUT/,
						{ token: "comment.doc" }
					]
				]
			}
		});
	}
	monaco.languages.registerHoverProvider(props.type, {
		// 光标移入提示功能
		provideHover: function (model, position, token) {
			const lineword = model.getLineContent(position.lineNumber); // 获取光标悬停所在行的所有内容
			const word = model.getWordAtPosition(position)?.word; // 获取光标悬停的单词
			if (word === "name") {
				return {
					contents: [
						{ value: `${word}` },
						{
							value: [
								"这是name的一些介绍",
								"这是name的一些介绍"
							].join("\n\n")
						}
					]
				};
			} else if (undefined !== word) {
				return {
					contents: [
						{ value: `${word}` },
						{
							value: [lineword].join("\n\n")
						}
					]
				};
			}
		}
	});
	console.log(typeof props.readonly);

	editor.value = monaco.editor.create(editorContainer.value, {
		value: data.value,
		language: props.type,
		folding: true, // 是否折叠
		foldingHighlight: true, // 折叠等高线
		foldingStrategy: "indentation", // 折叠方式  auto | indentation
		showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
		disableLayerHinting: true, // 等宽优化
		emptySelectionClipboard: false, // 空选择剪切板
		selectionClipboard: false, // 选择剪切板
		automaticLayout: true, // 自动布局
		theme: "vs",
		codeLens: false, // 代码镜头
		scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
		colorDecorators: true, // 颜色装饰器
		accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
		lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
		lineNumbersMinChars: 5, // 行号最小字符   number
		readOnly: props.readonly, //是否只读  取值 true | false
		mouseWheelZoom: true,
		minimap: {
			enabled: false // 是否启用预览图
		} // 预览图设置
	});
	// 监听值的变化
	editor.value.onDidChangeModelContent((val: any) => {
		// 给父组件实时返回最新文本
		emit("update:modelValue", toRaw(editor.value).getValue());
	});
});

// 编辑器避免重复赋值
watchEffect(() => {
	if (
		editor.value &&
		toRaw(editor.value).getValue() !== props.modelValue
	)
		toRaw(editor.value).setValue(props.modelValue);
});
const copyFun = () => {
	// if (navigator.clipboard) {
	// 	navigator.clipboard.writeText(props.modelValue);
	// }

	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard
			.writeText(props.modelValue)
			.then(() => {
				ElMessage.success("复制成功");
			})
			.catch(() => {
				ElMessage.error("复制失败");
			});
	} else {
		// 创建text area
		const textArea = document.createElement("textarea");
		textArea.value = props.modelValue;
		// 使text area不在viewport，同时设置不可见
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise<void>((resolve, reject) => {
			// 执行复制命令并移除文本框
			document.execCommand("copy")
				? resolve()
				: reject(new Error("出错了"));
			textArea.remove();
		}).then(
			() => {
				ElMessage.success("复制成功");
			},
			() => {
				ElMessage.error("复制失败");
			}
		);
	}
};
defineExpose({
	monaco,
	editor
});
</script>

<style>
.monaco {
  text-align: left;
	width: 100%;
	border: 1px solid #eee;
	padding: 10px;
	padding-left: 0;
	border-radius: 5px;
}
.copy-button-box {
	text-align: right;
	padding-right: 14px;
	margin-bottom: 10px;
}
.monaco-box {
	width: 100%;
	padding: 12px;
	padding-left: 0;
	border-radius: 4px;
}
</style>

