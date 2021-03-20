<template>
  <div class="container">
    <div v-if="comments.length >= 1" >
      <div class="card" v-for="comment in comments" :key="comment._id">
        <h5 class="card-header">
          Название комментария: {{ comment.name }}
        </h5>
        <div class="card-body">
          <h5 class="card-title">Текст комментария: {{ comment.content }}</h5>
          <label>Новое содержимое комментария: </label>
          <input type="text" v-model="commentContent" />
          <a @click="editComment(comment)" class="btn btn-primary">Редактировать</a>
          <a @click="deleteComment(comment)" class="btn btn-primary">Удалить</a>
        </div> 
      </div>
    </div>
    <div  v-else-if="comments.length <= 0">
      Список комментариев пуст
    </div>
    <label>Название комментария: </label>
    <input type="text" v-model="commentName" />
    <label>Содержимое комментария: </label>
    <input type="text" v-model="commentContent" />
    <a @click="addComment(commentName, commentContent)" class="btn btn-primary">Добавить новый комментарий</a>
  </div>
</template>

<script>
export default {
  data(){
    return {
      comments: [],
      commentName: '',    
      commentContent: '',
    }
  },
  methods:{
    addComment(commentName, commentContent){
      fetch(`http://localhost:4000/add?name=${commentName}&content=${commentContent}`, {
        mode: 'cors',
        method: 'GET',
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
      .then(result => {
        window.location.reload()
      });
    },
    editComment(comment){
      fetch(`http://localhost:4000/edit?name=${comment.name}&content=${this.commentContent}`, {
        mode: 'cors',
        method: 'GET'
      }).then(response => response.body).then(rb  => {
        const reader = rb.getReader()
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then( ({done, value}) => {
                if (done) {
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
      .then(result => {
        window.location.reload()
      });
    },
    deleteComment(comment){
      fetch(`http://localhost:4000/delete?name=${comment.name}`, {
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
      .then(result => {
        window.location.reload()
      });
    },
  },
  mounted(){
    fetch(`http://localhost:4000/`, {
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
      .then(result => {
        this.comments = JSON.parse(result)
      });
    },
}
</script>