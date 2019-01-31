<template lang="pug">
.workspace-container
  .top-title Super dashboard
    el-breadcrumb(separator="/")
      el-breadcrumb-item.color-red(:to="`/`") Home
      el-breadcrumb-item(:to="`/super-dashboard`") Super dashboard
      el-breadcrumb-item {{$route.meta.title}}
  .float-container
    router-view
</template>

<script>

export default {
  data () {
    return {
    }
  },
}

</script>
