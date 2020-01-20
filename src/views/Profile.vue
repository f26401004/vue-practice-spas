<template lang="pug">
  div(id="profile_page_root")
    div(ref="profileBackground" id="profile_page_background" class="decorator")
    div(ref="profilePicture" id="profile_picture" class="decorator")
      img(v-cloak :src="avatar")
      a-upload(
        name="avatar"
        :multiple="false"
        :action="uploadImage"
        @beforeUpload="checkImageFile"
        :showUploadList="false")
        a-button(shape="circle")
          a-icon(type="camera" theme="filled")
    div(id="profile_info" class="decorator")
      a-icon(
        type="info-circle"
        theme="filled"
        @click="showInfo"
        style="font-size: 24px; color: white; border-radius: 100%; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09);")
    perfect-scrollbar(style="width: 100%; height: calc(100%);" @ps-scroll-y="handleScroll" :options="{ swipeEasing: true, wheelSpeed: 1/120 }")
      a-row(type="flex" justify="center" align="middle" style="margin-top: 19vh;")
        h2(style="color: white; margin: 0") {{ user.username }}
      a-row(type="flex" justify="center" align="middle" style="margin-bottom: 18px;")
        a-icon(style="color: white; font-size: 32px; margin-right: 32px; z-index: 999;" type="github" v-longpress="() => openEditModal('github')")
        a-icon(style="color: white; font-size: 32px; margin-right: 32px; z-index: 999;" type="facebook" theme="filled" v-longpress="() => openEditModal('facebook')")
        a-icon(style="color: white; font-size: 32px; z-index: 999;" type="linkedin" theme="filled" v-longpress="() => openEditModal('linkedin')")
      a-row(type="flex" justify="center" align="middle" id="profile_status_container")
        p(style="text-align: center;") Display slogan here. <br> And you can at most two lines.
        a-button(type="primary" size="large" shape="round" class="decorator" style="top: calc(100% - 20px); ") logout
      a-row(style="margin-top: 0; padding: 0 12px;")
        a-row(type="flex" justify="start" align="middle" style="width: 100%; margin-top: 44px;")
          a-icon(type="file-done" :style="{ 'color': blue.primary }" style="margin-right: 12px; font-size: 16px;")
          label(:style="{ 'color': blue.primary }" style="font-weight: 900;") Attendance
        a-row(style="margin: 0;")
          a-progress( :percent="user.attendance" status="active" )
        a-row(type="flex" justify="start" align="middle" style="width: 100%;")
          a-icon(type="crown" :style="{ 'color': blue.primary }" style="margin-right: 12px; font-size: 16px;")
          label(:style="{ 'color': blue.primary }" style="font-weight: 900;") Activity Rate
        a-row(style="margin: 0;")
          a-progress( :percent="user.activityRate" status="active" strokeColor="#52c41a" )
        a-row(type="flex" justify="start" align="middle" style="width: 100%;")
          a-icon(type="read" :style="{ 'color': blue.primary }" style="margin-right: 12px; font-size: 16px;")
          label(:style="{ 'color': blue.primary }" style="font-weight: 900;") Knowledge
        a-row(style="margin: 0;")
          a-progress( :percent="user.knowledge" status="active" strokeColor="#fa8c16" )
        a-row(type="flex" justify="start" align="middle" style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.09); padding-bottom: 8px;")
          a-icon(type="schedule" :style="{ 'color': blue.primary }" style="margin-right: 12px; font-size: 16px;")
          label(:style="{ 'color': blue.primary }" style="font-weight: 900;") Schedule
        a-list(itemLayout="horizontal" size="small" :dataSource="user.schedules" style="width: 100%; font-size: 12px; width: 100%;")
          a-list-item(slot="renderItem" slot-scope="item, index")
            a-list-item-meta(:description="item.description")
              a-avatar(slot="avatar" :src="item.icon")
              a-row(slot="title")
                a-col(:span="12")
                  a-row(type="flex" justify="start" align="middle")
                    label {{ item.title }}
                a-col(:span="12")
                  a-row(type="flex" justify="end" align="middle")
                    time(:style="{ 'color': blue[2] }" style="text-align: right; font-weight: 300;") {{ item.date.toDateString() }}
    a-modal(:title="`Update ${linkType} Link`" v-model="showEditModal", @ok="updateLink" okText="Update" cancelText="Cancel")
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { blue } from '@ant-design/colors'
import Firebase from '@/firebase'
import axios from 'axios'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  data: function () {
    return {
      blue,
      loading: false,
      linkType: '',
      showEditModal: false
    }
  },
  components: {
    PerfectScrollbar
  },
  computed: {
    ...mapState('feature', {
      user: 'currentUser',
      avatar: 'userAvatar'
    })
  },
  beforeMount: async function () {
    if (this.avatar) {
      return
    }
    try {
      const storageRef = Firebase.storage().ref()
      const url = await storageRef.child(`images/avatar/${this.user.uid}`).getDownloadURL()
      const response = await axios.get(url, { responseType: 'blob' })
      this.SET_currentUserAvatar(window.URL.createObjectURL(response.data))
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapMutations('feature', ['SET_currentUserAvatar']),
    handleScroll: function (event) {
      const currentPosition = event.srcElement.scrollTop
      this.$refs.profileBackground.style.transform = `skewY(-10deg) translateY(${currentPosition * (-1) - 48}px)`
      this.$refs.profilePicture.style.transform = `translateY(${currentPosition * (-1)}px)`
    },
    checkImageFile: function (file) {
      try {
        const isImage = file.type.indexOf('image/') === 0
        if (!isImage) {
          throw new Error('You can not upload this image file!')
        }
        return true
      } catch (error) {
        return false
      }
    },
    uploadImage: async function (file) {
      const metadata = {
        contentType: file.type
      }
      const storageRef = await Firebase.storage().ref()
      const imageFile = storageRef.child(`images/avatar/${this.user.uid}`)
      try {
        this.loading = true
        await imageFile.put(file, metadata)
        this.SET_currentUserAvatar(window.URL.createObjectURL(file))
        this.loading = false
      } catch (error) {
      }
    },
    showInfo: function () {
      console.log('test')
      this.$info({
        width: 'calc(100vw - 48px)',
        title: 'Profile Page',
        content: 'You can longpress on the link icons to edit the link address.'
      })
    },
    openEditModal: function (type) {
      this.linkType = type
      this.showEditModal = true
    },
    updateLink: function () {
    }
  }
}
</script>

<style lang="scss" scoped>
  #profile_page_root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-auto-flow: row;
    justify-content: center;
    justify-items: center;
    align-content: flex-start;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
    overflow: hidden;
  }
  #profile_info {
    top: 24px;
    right: 24px;
    z-index: 999;
  }
  #profile_page_background {
    top: 0;
    left: 0;
    width: 100%;
    height: 45vh;
    background: linear-gradient(0deg, rgba(9,109,217,1) 0%, rgba(89,126,247,1) 100%);
    z-index: -1;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.09);
    transform: skewY(-10deg) translateY(-48px);
    transition: .2s transform cubic-bezier(0.215, 0.61, 0.355, 1);

    &:after {
      content : "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      background-image: url('../assets/profile_background.svg');
      width: 100%;
      height: 100%;
      background-size: 150%;
      background-position: 50% 90%;
      background-repeat: no-repeat;
      opacity: 0.2;
    }
  }
  #profile_picture {
    top: 5vh;
    width: 30vw;
    height: 30vw;
    border-radius: 100%;
    background-color: gray;
    transition: .1s transform cubic-bezier(0.215, 0.61, 0.355, 1);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100%;
    }
    &:before {
      position: absolute;
      top: -2vw;
      left: -2vw;
      content: "";
      width: 34vw;
      height: 34vw;
      border: 3px solid rgba(255, 255, 255, 0.75);
      border-radius: 100%;
    }
    & > span {
      position: absolute;
      top: calc(100% - 30px);
      left: calc(100% - 30px);
    }
  }

  #profile_status_container {
    position: relative;
    width: 100%;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09);
    padding: 12px;
    box-sizing: border-box;
  }
</style>
