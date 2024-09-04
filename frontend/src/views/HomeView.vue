<template>
  <AppHeader />
  <div class="container" style="margin-top: 30px;">
    <div class="row g-4">
      <div class="col-md-3" v-for="event in events" :key="event._id">
        <div class="card mb-3">
          <div class="card-header">
            <i class="bi bi-info-circle" v-b-tooltip.hover :title="event.description"></i>
            {{ event.name }}
            <span class='badge badge-right bg-secondary ms-1'>{{ event.priority }}</span>
            <span :class="['badge badge-right', getBadgeClass(event.type.name)]">{{ event.type.name }}</span>

          </div>
          <div class="card-body p-5">
            <!-- <div class="row">
              <div class="col">
                <p class="card-text"><small class="text-body-secondary">priority: {{ event.priority }}</small></p>
              </div> -->
            <div class="col">
              <h1 class="text-center">{{ getRandomCounter() }}</h1>
            </div>
            <!-- </div> -->
          </div>
          <div class="card-footer bg-transparent">
            <div class="btn-group" role="group" aria-label="card-b-g" style="float: right;">
              <router-link :to="{ name: 'Edit', params: { id: event._id } }"
                class="btn btn-sm btn-outline-secondary">Edit</router-link>
              <button v-if="!event.confirmDelete" class="btn btn-sm btn-outline-secondary"
                @click="confirmDelete(event._id)">Delete</button>
              <button v-else class="btn btn-sm btn-outline-danger" @click="deleteEvent(event._id)">Sure?</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-link to="/create" class="btn btn-success fab">+</router-link>
  </div>
</template>

<script>
import { server } from "@/utils/helper";
import AppHeader from "@/components/AppHeader.vue";
export default {
  data() {
    return {
      events: []
    };
  },
  components: {
    AppHeader
  },
  created() {
    this.fetchEvents();
  },
  methods: {
    confirmDelete(eventId) {
      const event = this.events.find(event => event._id === eventId);
      if (event) {
        event.confirmDelete = true;
        setTimeout(() => {
          event.confirmDelete = false;
        }, 5000);
      }
    },
    fetchEvents() {
      this.$axios.get(`${server.baseURL}/events`)
        .then(response => {
          this.events = response.data;
        }).catch(error => {
          console.log(error);
        });
    },
    deleteEvent(id) {
      this.$axios.delete(`${server.baseURL}/events/delete/${id}`).then(data => {
        console.log(data.data.event._id);
        if (data.data.event._id) {
          this.events = this.events.filter(event => event._id !== data.data.event._id);
        }
      });
    },
    getRandomCounter() {
      return Math.floor(Math.random() * 100);
    },
    getBadgeClass(typeName) {
      switch (typeName.toLowerCase()) {
        case 'app':
          return 'bg-primary';
        case 'crosspromo':
          return 'bg-success';
        case 'liveops':
          return 'bg-warning';
        case 'ads':
          return 'bg-info';
        default:
          return 'bg-secondary';
      }
    },
  }
};
</script>

<style scoped>
.badge-right {
  float: right;
}

.card {
  margin-bottom: 20px;
  min-height: 250px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.priority-text {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.btn-group {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

h1 {
  font-size: 60px;
  color: #363636;
}
</style>