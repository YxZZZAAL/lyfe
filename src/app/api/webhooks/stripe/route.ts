import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const sub = event.data.object as Stripe.Subscription;

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    await prisma.user.updateMany({
      where: { stripeCustomerId: sub.customer as string },
      data: {
        stripeSubscriptionId: sub.id,
        subscriptionStatus: sub.status === 'active' ? 'active' : 'inactive',
      },
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    await prisma.user.updateMany({
      where: { stripeCustomerId: sub.customer as string },
      data: { subscriptionStatus: 'inactive' },
    });
  }

  return NextResponse.json({ received: true });
}
