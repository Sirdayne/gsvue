<template lang="pug">
#dashboard.workspace-container
  .workspace
    .top-title Dashboard
      el-breadcrumb(separator="/")
        el-breadcrumb-item.color-red(:to="`/`") Home
        el-breadcrumb-item.color-red(:to="`/dashboard`") Dashboard
        el-breadcrumb-item {{ $route.meta.title }}
    .float-container
      router-view
</template>

<script>

export default {
  name: 'dashboard',
  data () {
    return {
    }
  },
}

</script>
