<template lang="pug">
  a-spin(:spinning="loading")
    div(id="profile_page_root")
      div(ref="profileBackground" id="profile_page_background" class="decorator")
      div(ref="profilePicture" id="profile_picture" class="decorator")
        img(v-show="avatar" :src="avatar")
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
          style="display: block; font-size: 24px; color: white; border-radius: 100%; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09);")
      perfect-scrollbar(style="width: 100%; height: calc(100%);padding: 0 24px; " @ps-scroll-y="handleScroll" :options="{ swipeEasing: true, wheelSpeed: 1 }")
        a-row(type="flex" justify="center" align="middle" style="margin-top: 24vh;")
          h2(style="color: white; margin: 0") {{ user.username }}
        a-row(type="flex" justify="center" align="middle" style="margin-bottom: 18px;")
          a-icon(style="color: white; font-size: 32px; margin-right: 32px; z-index: 999;" type="github" v-longpress="() => openEditModal('Github')")
          a-icon(style="color: white; font-size: 32px; margin-right: 32px; z-index: 999;" type="facebook" theme="filled" v-longpress="() => openEditModal('Facebook')")
          a-icon(style="color: white; font-size: 32px; z-index: 999;" type="linkedin" theme="filled" v-longpress="() => openEditModal('Linkedin')")
        a-row(type="flex" justify="center" align="middle" id="profile_status_container")
          pre(style="text-align: center; max-height: 48px; overflow-y: hidden" v-cloak v-html="user.status.slice(0, 50)")
          a-button(v-if="isCurrentUser" type="primary" shape="round" size="large" icon="edit" @click="openStatusEditModal" class="decorator" style="top: calc(100% - 20px);") Edit
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
          a-list(itemLayout="horizontal" size="small" :dataSource="schedules" :loading="loadSchedule" style="width: 100%; font-size: 12px; width: 100%;")
            a-list-item(slot="renderItem" slot-scope="item, index")
              a-list-item-meta(:description="item.description")
                a-avatar(slot="avatar" :src="item.icon")
                a-row(slot="title")
                  a-col(:span="12")
                    a-row(type="flex" justify="start" align="middle")
                      label {{ item.title }}
                  a-col(:span="12")
                    a-row(type="flex" justify="end" align="middle")
                      time(:style="{ 'color': blue[2] }" style="text-align: right; font-weight: 300;") {{ item.time | timestampToDate }}
      a-modal(class="custom-modal-style"
        v-model="showLinkEditModal"
        @ok="updateLink"
        okText="Update"
        cancelText="Cancel"
        :okButtonProps="{ props: { loading: updateLinkButtonLoading } }")
        div(slot="title")
          a-icon(:type="linkType.toLowerCase()" theme="filled" style="font-size: 18px; margin-right: 12px;")
          h3(style="display: inline-block; margin: 0;") Update {{linkType}} Link
        a-input(size="large" :placeholder="`${linkType} address`" v-model="newAddress")
          a-tooltip(slot="suffix" :title="`Please enter new ${linkType} address`")
            a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45);")
      a-modal(class="custom-modal-style"
        v-model="showStatusEditModal"
        @ok="updateStatus"
        okText="Update"
        cancelText="Cancel"
        :okButtonProps="{ props: { loading: updateStatusButtonLoading } }")
        div(slot="title")
          a-icon(type="form" theme="filled" style="font-size: 18px; margin-right: 12px;")
          h3(style="display: inline-block; margin: 0;") Update Your Status (Max Length: 50)
        a-textarea(size="large" placeholder="Status" v-model="newStatus" :row="2")
          a-tooltip(slot="suffix" :title="`Please enter new status`")
            a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45);")
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { blue } from '@ant-design/colors'
import axios from 'axios'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  data: function () {
    return {
      blue,
      user: {
        uid: '',
        username: 'unknown',
        status: 'unknown',
        attendance: 0,
        activityRate: 0,
        knowledge: 0,
        schedules: []
      },
      schedules: [],
      avatar: '',
      linkType: '',
      newAddress: '',
      newStatus: '',
      updateLinkButtonLoading: false,
      updateStatusButtonLoading: false,
      showLinkEditModal: false,
      showStatusEditModal: false
    }
  },
  components: {
    PerfectScrollbar
  },
  computed: {
    ...mapState('user', {
      currentUser: 'currentUser',
      currentUserAvatar: 'userAvatar',
      currentUserSchedules: 'userSchedules'
    }),
    ...mapState('feature', {
      loading: 'loading',
      firebase: 'firebase'
    }),
    isCurrentUser: function () {
      if (this.$route.params.uid) {
        return this.$route.params.uid === this.currentUser.uid
      }
      return this.currentUser.uid !== undefined
    },
    loadSchedule: function () {
      return this.schedules.length !== this.user.schedules.slice(0, 5).length
    }
  },
  filters: {
    timestampToDate: function (value) {
      const time = new Date(value.seconds * 1000)
      return time.toDateString()
    }
  },
  beforeMount: async function () {
    if (!this.$route.params.uid) {
      this.user = this.currentUser
      this.avatar = this.currentUserAvatar
      this.schedules = this.currentUserSchedules.slice(0, 5)
      console.log(this.currentUserSchedules)
      return
    }
    // retrieve the other user's data
    let responseAvatar
    let responseUser
    // display the loading effect
    this.SET_loading(true)
    // retrieve user data
    try {
      const storageRef = this.firebase.storage().ref()
      const url = await storageRef.child(`images/avatar/${this.$route.params.uid}`).getDownloadURL()
      responseAvatar = await axios.get(url, { responseType: 'blob' })
    } catch (error) {
      console.log(error.message)
    }
    // retrieve user avatar
    try {
      const docRef = await this.firebase.firestore().collection('users').doc(this.$route.params.uid)
      responseUser = await docRef.get()
      this.user = responseUser.data()
      this.avatar = responseAvatar ? window.URL.createObjectURL(responseAvatar.data) : null
      this.SET_loading(false)
    } catch (error) {
      console.log(error.message)
    }
    // retrieve user schedules
    try {
      this.user.schedules.slice(0, 5).forEach(doc => {
        doc.get().then(response => {
          this.schedules.push(response.data())
          console.log(this.schedules)
        })
      })
    } catch (error) {
      console.log(error.message)
    }
  },
  methods: {
    ...mapMutations('user', ['SET_currentUserAvatar', 'UPDATE_currentUser']),
    ...mapMutations('feature', ['SET_loading']),
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
      const storageRef = await this.firebase.storage().ref()
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
      if (!this.isCurrentUser) {
        this.$info({
          class: 'custom-modal-style',
          okType: 'ghost',
          title: 'Profile Page',
          content: h => (<div>
            <ul style="margin: 0; padding-left: 24px;">
              <li>Obtain <b>Attendance</b> point by join the study group meetings.</li>
              <li>Increase <b>Activity Rate</b> by posting coding problem and playing QUICK ANSWER GAME.</li>
              <li>Increase <b>Knowledge</b> point by playing QUICK ANSWER GAME.</li>
            </ul>
            <br/>
          </div>)
        })
        return
      }
      this.$info({
        class: 'custom-modal-style',
        okType: 'ghost',
        title: 'Profile Page',
        content: h => (<div>
          <ul style="margin: 0; padding-left: 24px;">
            <li>Obtain <b>Attendance</b> point by join the study group meetings.</li>
            <li>Increase <b>Activity Rate</b> by posting coding problem and playing QUICK ANSWER GAME.</li>
            <li>Increase <b>Knowledge</b> point by playing QUICK ANSWER GAME.</li>
          </ul>
          <br/>
          <p><b>Tips:</b> You can <b>click on</b> the camera icon near your avatar to upload your avatar.</p>
          <p><b>Tips:</b> You can <b>longpress</b> the link icons to edit the link address.</p>
          <p><b>Tips:</b> You can <b>click on</b> the edit button to edit the status disaplyed when you are not in study group meeting.</p>
        </div>)
      })
    },
    openEditModal: function (type) {
      if (!this.currentUser.uid || this.$route.params.uid !== this.currentUser.uid) {
        window.open(this.user[`${type.toLowerCase()}Link`], '_blank')
        return
      }
      this.linkType = type
      this.showLinkEditModal = true
      this.newAddress = this.user[`${this.linkType.toLowerCase()}Link`]
    },
    openStatusEditModal: function () {
      this.showStatusEditModal = true
      this.newStatus = this.user.status || 'Display slogan here. \nAnd you can at most two lines.'
    },
    updateLink: async function () {
      if (this.newAddress.length === 0) {
        this.$message.error(`New ${this.linkType} link address can not be empty!`)
        this.showLinkEditModal = false
        return
      }
      try {
        this.updateLinkButtonLoading = true
        const data = {}
        data[`${this.linkType.toLowerCase()}Link`] = this.newAddress
        const docRef = await this.firebase.firestore().collection('users').doc(this.user.uid)
        await docRef.update(data)
        // update the local data
        this.UPDATE_currentUser(data)
        this.updateLinkButtonLoading = false
        this.showLinkEditModal = false
      } catch (error) {
        // display the error message to user
        this.$message.error(error.message)
      }
    },
    updateStatus: async function () {
      if (this.newStatus.length === 0) {
        this.$message.error('New status can not be empty!')
        this.showStatusEditModal = false
        return
      }
      if (this.newStatus.length > 50) {
        this.$message.error('New status must within 50 length!')
        this.showStatusEditModal = false
        return
      }
      try {
        this.updateStatusButtonLoading = true
        const data = { status: this.newStatus }
        const docRef = await this.firebase.firestore().collection('users').doc(this.user.uid)
        await docRef.update(data)
        this.UPDATE_currentUser(data)
        this.updateStatusButtonLoading = false
        this.showStatusEditModal = false
      } catch (error) {
        this.$message.error(error.message)
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
    grid-template-rows: 1fr;
    grid-auto-flow: row;
    justify-content: center;
    justify-items: center;
    align-content: flex-start;
    align-items: center;
    overflow: hidden;

    width: 100%;
    height: 100%;
    overflow: auto;
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
