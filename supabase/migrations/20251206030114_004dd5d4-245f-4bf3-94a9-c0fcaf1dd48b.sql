-- Add columns to track requester and related post for accept/reject workflow
ALTER TABLE public.notifications 
ADD COLUMN requester_id uuid REFERENCES public.profiles(user_id),
ADD COLUMN related_post_id uuid,
ADD COLUMN related_post_type text,
ADD COLUMN status text DEFAULT 'pending';

-- Add index for faster lookups
CREATE INDEX idx_notifications_requester_id ON public.notifications(requester_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);