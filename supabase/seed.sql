INSERT INTO mentions (platform, author_name, author_id, message_text, thread_id, channel_name, created_at) VALUES
  -- Slack mentions
  ('slack', 'Tanaka Yuki',    'U0001', '@mention-collector デプロイの状況を教えて',          'T-slack-001', '#general',    '2026-02-25 09:15:00+09'),
  ('slack', 'Suzuki Haruto',  'U0002', '@mention-collector 本番環境のログを確認してほしい',   'T-slack-002', '#ops',        '2026-02-25 10:30:00+09'),
  ('slack', 'Sato Aoi',       'U0003', '@mention-collector CIが落ちてるんだけど原因わかる？', 'T-slack-003', '#engineering', '2026-02-25 14:00:00+09'),
  ('slack', 'Yamada Ren',     'U0004', '@mention-collector 来週のスプリントの見積もり頼む',   'T-slack-004', '#planning',   '2026-02-25 16:45:00+09'),
  ('slack', 'Tanaka Yuki',    'U0001', '@mention-collector ありがとう、確認できた！',         'T-slack-001', '#general',    '2026-02-25 17:00:00+09'),
  ('slack', 'Watanabe Mei',   'U0005', '@mention-collector ステージング環境のURL教えて',     'T-slack-005', '#dev',        '2026-02-26 08:30:00+09'),
  ('slack', 'Ito Sota',       'U0006', '@mention-collector API のレスポンスが遅い件',        'T-slack-006', '#backend',    '2026-02-26 09:00:00+09'),

  -- Discord mentions
  ('discord', 'kazu_dev',       'D0001', '@mention-collector サーバーの調子どう？',            'T-discord-001', 'server-status',  '2026-02-25 11:00:00+09'),
  ('discord', 'mika_design',    'D0002', '@mention-collector 新しいアイコン反映した？',         'T-discord-002', 'design-chat',    '2026-02-25 13:20:00+09'),
  ('discord', 'taro_bot_fan',   'D0003', '@mention-collector ping',                           'T-discord-003', 'bot-testing',    '2026-02-25 15:10:00+09'),
  ('discord', 'yui_frontend',   'D0004', '@mention-collector ビルドエラーの件、解決策ある？',    'T-discord-004', 'frontend',       '2026-02-25 18:30:00+09'),
  ('discord', 'kazu_dev',       'D0001', '@mention-collector 昨日の障害レポートまとめて',       'T-discord-005', 'incidents',      '2026-02-26 08:00:00+09'),
  ('discord', 'ryo_infra',      'D0005', '@mention-collector Kubernetes のノード数増やして',   'T-discord-006', 'infra',          '2026-02-26 10:15:00+09');
