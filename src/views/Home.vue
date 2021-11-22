<template>
  <div class="main">
    <div class="inputControl">
      <label class="inputFieldLabel" for="">
        Название сайта
      </label>
      <input v-model="siteName" placeholder="Введите название вашего сайта" type="text" class="form-control" />
    </div>
    <div class="inputControl">
      <label class="inputFieldLabel" for="">
        Пароль
      </label>
      <input v-model="password" placeholder="Введите пароля для доступа к сайту" type="password" class="form-control" />
    </div>
    <div class="inputControl">
      <label class="inputFieldLabel" for="">
        Организация
      </label>
      <input v-model="siteCompany" placeholder="Введите название вашей компании" type="text" class="form-control" />
    </div>
    <div class="inputControl">
      <label class="inputFieldLabel" for="">
        Префикс в БД
      </label>
      <input v-model="prefixDB" placeholder="Введите префикс таблиц в базе данных" type="text" class="form-control" />
    </div>
    <button class="btn btn-success" @click="createSite">
      Создать сайт
    </button>
  </div>
</template>

<script>

// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data() {
    return {
      siteName: '',
      password: '',
      siteCompany: '',
      prefixDB: ''
    }
  },
  mounted() {
    if (window.localStorage.getItem('lordres-site-data') !== null) {
      this.$router.push({ name: 'CPanel' })
    }
  },
  methods: {
    createSite() {
      fetch(`http://localhost:4000/api/sites/create/?sitename=${this.siteName}&password=${this.password}&sitecompany=${this.siteCompany}&dbprefix=${this.prefixDB}`, {
        mode: 'cors',
        method: 'GET'
      }).then(response => response.body).then(rb  => {
        const reader = rb.getReader()
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then( ({done, value}) => {
                if (done) {
                  console.log('done', done);
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                console.log(done, value);
                push();
              })
            }
            push();
          }
        });
    }).then(stream => {
        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
      })
      .then(async result => {
        if(JSON.parse(result).status === 'OK') {
          let lordresSiteData = JSON.parse(result).siteData
          let lordresSiteDataAsJSON = JSON.stringify(lordresSiteData)
          window.localStorage.setItem('lordres-site-data', lordresSiteDataAsJSON)
          this.$router.push({ name: 'CPanel' })
        } else {
          alert('Такой сайт уже существует')
        }
      })
    }
  },
  components: {
    
  }
}
</script>
<style scoped>
  
  .main {
    display: flex;
    flex-direction: column;
    background-color: rgb(235, 235, 235);
    min-height: 100%;
    width: 100%;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
  }

  .siteForm {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .inputFieldLabel {
    margin: 5px 0px;
  }

  .inputControl {
    margin: 15px 0px;
    width: 325px;
  }

</style>