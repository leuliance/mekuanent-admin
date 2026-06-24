INSERT INTO public.church_payment_methods (church_id, payment_gateway_id, payment_type, is_active, display_order)
SELECT
  c.id,
  pg.id,
  'payment_gateway',
  true,
  1
FROM (VALUES
  ('670fea23-bc02-4dd2-96e9-e2232359bbc7'::uuid),
  ('8fd1735f-ce2d-4aa3-82fd-8d61982406c7'::uuid)
) AS c(id)
CROSS JOIN (
  SELECT id FROM public.payment_gateways WHERE slug = 'chapa' LIMIT 1
) AS pg
ON CONFLICT DO NOTHING;
