-- Add blockchain_produce_id to crops table for mapping traceability_id <-> numeric produce ID
ALTER TABLE public.crops ADD COLUMN IF NOT EXISTS blockchain_produce_id bigint;
COMMENT ON COLUMN public.crops.blockchain_produce_id IS 'Numeric produce ID from blockchain (ProduceLedger contract)';
