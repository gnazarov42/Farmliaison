<template>
  <div>
    <div v-if="editor" class="row toolbar q-my-sm">
      <!-- Toolbar buttons for text formatting -->
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        icon="mdi-format-bold"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        icon="mdi-format-italic"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        icon="mdi-format-strikethrough"
      />
      <button
        v-if="false"
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        code
      </button>
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().unsetAllMarks().run()"
        icon="mdi-format-clear"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().clearNodes().run()"
        icon="mdi-layers-off"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
        icon="mdi-format-paragraph"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        icon="mdi-format-header-1"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        icon="mdi-format-header-2"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        icon="mdi-format-header-3"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        icon="mdi-format-header-4"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        icon="mdi-format-header-5"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        icon="mdi-format-header-6"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
        icon="mdi-link-variant"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().unsetLink().run()"
        :disabled="!editor.isActive('link')"
        icon="mdi-link-variant-off"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        icon="mdi-format-list-bulleted"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        icon="mdi-format-list-numbered"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        icon="mdi-format-indent-increase"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().setHorizontalRule().run()"
        icon="mdi-minus"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().setHardBreak().run()"
        icon="mdi-format-vertical-align-bottom"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        icon="mdi-undo"
      />
      <q-btn
        rounded
        outline
        color="primary"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        icon="mdi-redo"
      />
    </div>
    <EditorContent :editor="editor" class="text-editor" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { MarkdownSerializer } from 'prosemirror-markdown';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { marked } from 'marked';

// Add necessary imports for extensions
import Paragraph from '@tiptap/extension-paragraph';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Strike from '@tiptap/extension-strike';
import Italic from '@tiptap/extension-italic';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import HardBreak from '@tiptap/extension-hard-break';
import Code from '@tiptap/extension-code';
import Bold from '@tiptap/extension-bold';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';

// Props and emit setup
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);

const tableMap = new WeakMap();

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      protocols: ['https', 'mailto', 'tel'],
      HTMLAttributes: {
        // Change rel to different value
        // Allow search engines to follow links(remove nofollow)
        rel: 'noopener noreferrer',
        // Remove target entirely so links open in current tab
        target: '_blank',
        // validate: (href) => /^https?:\/\//.test(href),
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'edit-area',
    },
  },
  content: props.modelValue,
  onCreate({ editor }) {
    emit('update:modelValue', serialize(editor.schema, editor.getJSON()));
  },
  onUpdate({ editor }) {
    const content = editor.getJSON();
    emit('update:modelValue', serialize(editor.schema, content));
  },
});

watch(
  () => props.modelValue,
  (newContent) => {
    if (
      editor &&
      newContent !== serialize(editor.value.schema, editor.value.getJSON())
    ) {
      const deserialized = deserialize(editor.value.schema, newContent);
      editor.value.commands.setContent(deserialized);
    }
  },
);

function isInTable(node) {
  return tableMap.has(node);
}

function renderHardBreak(state, node, parent, index) {
  const br = isInTable(parent) ? '<br>' : '\\\n';
  for (let i = index + 1; i < parent.childCount; i += 1) {
    if (parent.child(i).type !== node.type) {
      state.write(br);
      return;
    }
  }
}

function renderOrderedList(state, node) {
  const { parens } = node.attrs;
  const start = node.attrs.start || 1;
  const maxW = String(start + node.childCount - 1).length;
  const space = state.repeat(' ', maxW + 2);
  const delimiter = parens ? ')' : '.';
  state.renderList(node, space, (i) => {
    const nStr = String(start + i);
    return `${state.repeat(' ', maxW - nStr.length) + nStr}${delimiter} `;
  });
}

function isPlainURL(link, parent, index, side) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  )
    return false;
  if (index === (side < 0 ? 1 : parent.childCount - 1)) return true;
  const next = parent.child(index + (side < 0 ? -2 : 1));
  return !link.isInSet(next.marks);
}

const serializerMarks = {
  ...defaultMarkdownSerializer.marks,
  [Bold.name]: defaultMarkdownSerializer.marks.strong,
  [Strike.name]: {
    open: '~~',
    close: '~~',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  [Italic.name]: {
    open: '_',
    close: '_',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  [Code.name]: defaultMarkdownSerializer.marks.code,
  [Link.name]: {
    open(state, mark, parent, index) {
      return isPlainURL(mark, parent, index, 1) ? '<' : '[';
    },
    close(state, mark, parent, index) {
      const href = mark.attrs.canonicalSrc || mark.attrs.href;

      return isPlainURL(mark, parent, index, -1)
        ? '>'
        : `](${state.esc(href)}${
            mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : ''
          })`;
    },
  },
};

const serializerNodes = {
  ...defaultMarkdownSerializer.nodes,
  [Paragraph.name]: defaultMarkdownSerializer.nodes.paragraph,
  [BulletList.name]: defaultMarkdownSerializer.nodes.bullet_list,
  [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
  [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
  [OrderedList.name]: renderOrderedList,
  [HardBreak.name]: renderHardBreak,
  [Blockquote.name]: (state, node) => {
    if (node.attrs.multiline) {
      state.write('>>>');
      state.ensureNewLine();
      state.renderContent(node);
      state.ensureNewLine();
      state.write('>>>');
      state.closeBlock(node);
    } else {
      state.wrapBlock('> ', null, node, () => state.renderContent(node));
    }
  },
};

function serialize(schema, content) {
  const proseMirrorDocument = schema.nodeFromJSON(content);
  const serializer = new MarkdownSerializer(serializerNodes, serializerMarks);

  return serializer.serialize(proseMirrorDocument, {
    tightLists: true,
  });
}

function deserialize(schema, content) {
  const html = marked(content);

  if (!html) return null;

  const parser = new DOMParser();
  const { body } = parser.parseFromString(html, 'text/html');

  // append original source as a comment that nodes can access
  // body.append(document.createComment(content));

  const state = ProseMirrorDOMParser.fromSchema(schema).parse(body);

  return state.toJSON();
}

function setLink() {
  const previousUrl = editor.value.getAttributes('link').href;
  // TODO: add a custom dialog
  const url = window.prompt('URL', previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run();
}

onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>

<style lang="scss" scoped>
.toolbar {
  gap: 3px;
}
.is-active {
  background-color: $secondary !important;
  color: white !important;
}

:deep(.edit-area) {
  outline: none;
  border: 1px solid green !important;
  height: 400px;
  overflow-y: auto;
  border: 1px solid $dark-olive;
  padding: 10px;
  border-radius: 16px;
}
</style>
