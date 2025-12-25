<script>
  import ChatWidget from './components/ChatWidget.svelte';
</script>

<main>
  <div class="container">
    <header>
      <h1>SpurStore</h1>
      <p>Welcome! Chat with our AI support agent for help with orders, shipping, returns, and more.</p>
    </header>
    <ChatWidget />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  main {
    width: 100%;
    max-width: 1200px;
  }

  .container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 32px;
    text-align: center;
  }

  header h1 {
    margin: 0 0 8px 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  header p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
</style>

