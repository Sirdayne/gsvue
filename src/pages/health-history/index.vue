<template lang="pug">
.workspace-container
  .top-title Health History
    el-breadcrumb(separator="/")
      el-breadcrumb-item.color-red(:to="`/`") Home
      el-breadcrumb-item.color-red Health History
      el-breadcrumb-item {{$route.meta.title}}
  .float-container
    router-view
</template>

<script>
export default {
  name: 'progress-notes',
  data () {
    return {
    }
  }
}

</script>
