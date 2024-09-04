<template>
    <div>
      <AppHeader />
      <div class="container" style="margin-top: 30px;">
        <h2 class="text-center mb-4">Create Event</h2>
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card shadow-sm">
              <div class="card-body">
                <form id="create-event-form" @submit.prevent="createEvent">
                  <div class="mb-3">
                    <label for="event_id" class="form-label">Event ID</label>
                    <input type="number" id="event_id" v-model="id" name="event_id" class="form-control"
                      placeholder="Enter event ID" @blur="v$.id.$touch">
                    <div class="input-errors" v-for="error of v$.id.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" id="name" v-model="name" name="name" class="form-control"
                      placeholder="Enter event name" @blur="v$.name.$touch">
                    <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea id="description" v-model="description" name="description" class="form-control"
                      placeholder="Enter event description" @blur="v$.description.$touch"></textarea>
                    <div class="input-errors" v-for="error of v$.description.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="type" class="form-label">Type</label>
                    <select id="type" v-model="type" name="type" class="form-control" @blur="v$.type.$touch">
                      <option value="">Select Event Type</option>
                      <option v-for="type in eventTypes" :key="type._id" :value="type._id">{{ type.name }}</option>
                    </select>
                    <div class="input-errors" v-for="error of v$.type.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="priority" class="form-label">Priority</label>
                    <div class="d-flex align-items-center">
                        <input type="range" min="0" max="10" step="1" id="priority" v-model.number="priority" name="priority" class="form-control" @blur="v$.priority.$touch">
                        <span class="ms-3">{{ priority }}</span>
                    </div>
                    <div class="input-errors" v-for="error of v$.priority.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>
                  <div class="form-group col-md-4 pull-right">
                    <button class="btn btn-success w-100" type="submit">{{ isEdit ? 'Edit' : 'Create' }} Event</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>


<script>
import axios from "axios";
import { server } from "../../utils/helper";
import router from "../../router";
import { useVuelidate } from '@vuelidate/core';
import { between, minLength, required } from '@vuelidate/validators';
import AppHeader from "@/components/AppHeader.vue";

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    components: {
        AppHeader
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            id: { required },
            name: { required, minLength: minLength(3) },
            description: { required },
            type: { required },
            priority: { required, between: between(0, 10) }
        };
    },
    data() {
        return {
            id: null,
            name: "",
            description: "",
            type: "",
            priority: 5,
            eventTypes: [],
            
        };
    },
    mounted() {
        this.fetchTypes();
        if (this.isEdit) {
            this.fetchEventDetails();
        }
    },
    methods: {
        fetchTypes() {
            axios.get(`${server.baseURL}/event-types`)
                .then(response => {
                    this.eventTypes = response.data;
                })
                .catch(error => {
                    console.error('Error fetching country code:', error);
                });

        },
        fetchEventDetails() {
            axios.get(`${server.baseURL}/events/${this.$route.params.id}`)
                .then(response => {
                    const event = response.data;
                    this.id = event.id;
                    this.name = event.name;
                    this.description = event.description;
                    this.type = event.type;
                    this.priority = event.priority;
                })
                .catch(error => {
                    console.error('Error fetching event details:', error);
                });
        },
        createEvent() {
            // if ($v.$invalid) { 
            //     return;
            // }
            let postData = {
                id: this.id,
                name: this.name,
                description: this.description,
                type: this.type,
                priority: this.priority,
                country: this.countryCode
            };
            this.__submitToServer(postData);
        },
        __submitToServer(data) {
            const url = this.isEdit ? `${server.baseURL}/events/edit/${this.$route.params.id}` : `${server.baseURL}/events/create`;
            const method = this.isEdit ? 'put' : 'post';
            axios({ method, url, data })
                .then(response => {
                    console.log(response.data);
                    router.push({ name: "home" });
                })
                .catch(error => {
                    console.error('Error submitting event:', error);
                });
        }
    }
};
</script>
<style scoped>
.card {
  border-radius: 10px;
}
.input-group-text {
  background-color: #f8f9fa;
}
.input-errors {
  color: red;
}
.error-msg {
  font-size: 0.875em;
}
</style>