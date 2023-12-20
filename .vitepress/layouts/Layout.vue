<template>
  <div>
    <table>
      <tr>
        <th>CIP</th>
        <th>Title</th>
        <th>Author</th>
        <th>Status</th>
        <th>Last Call Deadline</th>
        <th>Type</th>
        <th>Created</th>
      </tr>
      <tr>
        <td>{{ $frontmatter.cip }}</td>
        <td>{{ $frontmatter.title }}</td>
        <td>{{ $frontmatter.author }}</td>
        <td>{{ $frontmatter.status }}</td>
        <td>{{ $frontmatter['last-call-deadline'] }}</td>
        <td>{{ $frontmatter.type }}</td>
        <td>{{ $frontmatter.created }}</td>
      </tr>
    </table>
    <slot />
  </div>
</template>

<script>
import DefaultLayout from 'vitepress/dist/client/theme-default/Layout.vue'

export default {
  extends: DefaultLayout
}
</script>