<template lang="pug">
.workspace-container
  .top-title Progress notes
    el-breadcrumb(separator="/")
      el-breadcrumb-item.color-red(:to="`/`") Home
      el-breadcrumb-item.color-red(:to="`/progress-notes`") Progress notes
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
