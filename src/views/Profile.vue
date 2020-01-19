<template lang="pug">
  div(id="profile_page_root")
    div(id="profile_page_background" class="decorator")
    div(id="profile_picture" class="decorator")
      img(v-cloak :src="avatar")
      a-upload(
        name="avatar"
        :multiple="false"
        :action="uploadImage"
        @beforeUpload="checkImageFile"
        :showUploadList="false")
        a-button(shape="circle")
          a-icon(type="camera" theme="filled")
    a-row(type="flex" justify="center" align="middle" style="margin-top: 18vh;")
      h2(style="color: white; margin: 0") {{ user.username }}
    a-row(type="flex" justify="center" align="middle" :gutter="32")
      a-col(:span="8")
        a-icon(style="color: white; font-size: 32px;" type="github")
      a-col(style="color: white; font-size: 32px;" :span="8")
        a-icon(type="facebook" theme="filled")
      a-col(style="color: white; font-size: 32px;" :span="8")
        a-icon(type="linkedin" theme="filled")
    a-row(type="flex" justify="center" align="middle" id="profile_status_container")
      p(style="text-align: center;") Display slogan here. <br> And you can at most two lines.
      a-button(type="primary" size="large" shape="round" class="decorator" style="top: calc(100% - 20px); ") logout
    a-row(type="flex" justify="space-between" align="middle" style="width: 100%; margin-top: 44px;")
      label(:style="{ 'color': blue.primary }" style="font-weight: 900;") Attendence
      label x1
    a-row(type="flex" justify="space-between" align="middle" style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.09);")
      label(:style="{ 'color': blue.primary }" style="font-weight: 900; padding-bottom: 8px;") Schedule
    a-list(itemLayout="horizontal" size="small" :dataSource="test" style="font-size: 12px; width: 100%; height: 100%; padding-right: 12px; overflow-y: auto;")
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
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { blue } from '@ant-design/colors'
import Firebase from '@/firebase'
import axios from 'axios'

export default {
  data: function () {
    return {
      blue,
      busy: false,
      loading: false,
      test: new Array(3).fill({
        title: 'Vue practice!!',
        description: 'Practice vue framework and build a calendar APP for yourself!!',
        date: new Date(),
        join: false,
        icon: ''
      })
    }
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
    }
  }
}
</script>

<style lang="scss" scoped>
  #profile_page_root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, auto) 1fr;
    grid-auto-flow: row;
    justify-content: center;
    justify-items: center;
    align-content: flex-start;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
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
