<template>
  <div>
    <draggable
      v-model="localMediaFiles"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: 'flip-list',
      }"
      group="pics"
      item-key="id"
      class="list-group gallery"
      :disabled="false"
      @change="handleChange"
    >
      <template #item="{ element, index }">
        <div
          :key="element.id"
          class="item relative-position"
          :class="{ big: index === 0, tall: index === 3, wide: index === 5 }"
        >
          <NuxtImg
            class="img"
            v-if="element.url"
            :src="element.url"
            alt="Media File"
          />
          <q-btn
            round
            dense
            size="10px"
            color="negative"
            class="absolute-top-right q-ma-sm"
            icon="mdi-delete"
            @click="deleteImage(element)"
          />
        </div>
      </template>
    </draggable>

    <q-uploader
      url="/api/cloud/upload"
      label="Upload images"
      multiple
      batch
      class="q-my-md"
      style="max-width: 300px"
      @uploaded="onUploaded"
      @remove="onFileRemoved"
      @failed="onUploadFailed"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import draggable from 'vuedraggable';

const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
    required: true,
  },
  mediaFiles: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['updateMediaFiles']);

const $q = useQuasar();
const { data } = useAuth();
const locale = useLocale();

const localMediaFiles = ref([...props.mediaFiles]);

watch(
  () => props.mediaFiles,
  (newFiles) => {
    if (Array.isArray(newFiles)) {
      localMediaFiles.value = [...newFiles];
    }
  },
);

const onUploaded = async (event) => {
  const uploadedFilesDetails = JSON.parse(event.xhr.response).body
    .uploadedFiles;
  if (uploadedFilesDetails.length > 0) {
    uploadedFilesDetails.forEach(async (fileDetails) => {
      await updateMediaFiles(fileDetails, (newSavedImage, action) => {
        emit('updateMediaFiles', newSavedImage, action);
      });
    });
    $q.notify({
      type: 'positive',
      message: `Files uploaded successfully: ${uploadedFilesDetails.length} files.`,
    });
  } else {
    console.error('No files were uploaded.');
    $q.notify({ type: 'negative', message: 'No files were uploaded.' });
  }
};

const onUploadFailed = (error) => {
  console.error('Upload failed:', error);
  $q.notify({ type: 'negative', message: 'File upload failed' });
};

const onFileRemoved = (file) => {
  // Handle file removal logic here if needed
};

const updateMediaFiles = async (newImage, done) => {
  try {
    const responseData = await $fetch(`/api/${locale}/media/new`, {
      method: 'POST',
      body: {
        url: newImage.url,
        entityId: props.entityId,
        entityType: props.entityType,
        propertyId: 'cloudinary',
        providerPublicId: newImage.details.public_id,
        metadata: newImage.details,
        authorId: data.value.user?.id,
      },
    });

    const newSavedImage = responseData.body.mediaFile;
    if (newSavedImage) {
      localMediaFiles.value.push(newSavedImage);
      done(newSavedImage, 'add');
    } else {
      console.error('Failed to create and fetch the new image');
    }
  } catch (error) {
    console.error('Error creating and fetching the new image:', error);
  }
};

const deleteImage = async (image) => {
  $q.dialog({
    title: 'Delete Image',
    message: 'Are you sure you want to delete this image?',
    cancel: true,
    persistent: true,
    ok: 'Delete',
    class: 'q-gutter-md',
  }).onOk(async () => {
    await deleteImageFromServer(image);
  });
};

const deleteImageFromServer = async (image) => {
  try {
    await $fetch(`/api/${locale}/media/${image.id}`, {
      method: 'DELETE',
    });
    localMediaFiles.value = localMediaFiles.value.filter(
      (item) => item.id !== image.id,
    );
    $q.notify({ type: 'positive', message: 'Image deleted successfully' });
    emit('updateMediaFiles', localMediaFiles.value, 'delete');
  } catch (error) {
    console.error('Error deleting the image:', error);
    $q.notify({ type: 'negative', message: 'Failed to delete the image' });
  }
};

const handleChange = () => {
  // Handle the change when the draggable component is reordered
  emit('updateMediaFiles', localMediaFiles.value, 'sort');
};
</script>

<style lang="scss" scoped>
.gallery {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(100px, 150px);
}
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.item {
  flex-basis: 200px;
}

.img {
  width: 100%;
  height: 100%;
  transition: filter 0.3s ease;
  border-radius: 16px;
  object-fit: cover;
}

.img:hover {
  filter: brightness(0.9);
}
</style>
