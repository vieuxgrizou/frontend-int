import type { WordPressSite } from '../types';

// Types d'événements WordPress
export type WordPressHook = 
  | 'post_published'
  | 'post_updated'
  | 'comment_created'
  | 'comment_updated'
  | 'comment_deleted';

// Configuration des webhooks WordPress
export interface WebhookConfig {
  event: WordPressHook;
  url: string;
  secret: string;
}

// Installation des webhooks WordPress
export async function setupWebhooks(site: WordPressSite, configs: WebhookConfig[]) {
  // Créer le code PHP pour les webhooks
  const code = generateWebhookCode(configs);
  
  // TODO: Installer le code via l'API WordPress
  console.log('Webhook code to install:', code);
}

function generateWebhookCode(configs: WebhookConfig[]): string {
  return `
<?php
// Intensify WordPress Webhooks

add_action('init', function() {
  ${configs.map(config => generateHookCode(config)).join('\n\n')}
});

function send_webhook($url, $data, $secret) {
  $body = json_encode($data);
  $signature = hash_hmac('sha256', $body, $secret);
  
  wp_remote_post($url, array(
    'headers' => array(
      'Content-Type' => 'application/json',
      'X-Webhook-Signature' => $signature
    ),
    'body' => $body,
    'timeout' => 15
  ));
}
`;
}

function generateHookCode(config: WebhookConfig): string {
  const { event, url, secret } = config;
  
  switch (event) {
    case 'post_published':
      return `
add_action('publish_post', function($post_id) {
  $post = get_post($post_id);
  $data = array(
    'event' => 'post_published',
    'post' => array(
      'id' => $post->ID,
      'title' => $post->post_title,
      'content' => $post->post_content,
      'excerpt' => $post->post_excerpt,
      'status' => $post->post_status,
      'type' => $post->post_type,
      'categories' => wp_get_post_categories($post_id),
      'tags' => wp_get_post_tags($post_id)
    )
  );
  send_webhook('${url}', $data, '${secret}');
});`;

    case 'comment_created':
      return `
add_action('wp_insert_comment', function($comment_id, $comment) {
  $data = array(
    'event' => 'comment_created',
    'comment' => array(
      'id' => $comment->comment_ID,
      'post_id' => $comment->comment_post_ID,
      'author' => $comment->comment_author,
      'content' => $comment->comment_content,
      'parent' => $comment->comment_parent,
      'status' => $comment->comment_approved
    )
  );
  send_webhook('${url}', $data, '${secret}');
}, 10, 2);`;

    default:
      return '';
  }
}