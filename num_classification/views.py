import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import NumberSerializer
from django.http import JsonResponse
from django.core.cache import cache


def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True


def is_perfect(n):
    sum_divisors = sum(i for i in range(1, n) if n % i == 0)
    return sum_divisors == n


def is_armstrong(n):
    digits = [int(d) for d in str(n)]
    num_digits = len(digits)
    return sum(d**num_digits for d in digits) == n


class ClassifyNumber(APIView):

    def get(self, request):
        number = request.GET.get('number')
        if not number or not number.isdigit():
            return JsonResponse({
                "number": number,
                "error": True
            }, status=status.HTTP_400_BAD_REQUEST)

        number = int(number)
        cache_key = f'fun_fact_{number}'
        fun_fact = cache.get(cache_key)
        if not fun_fact:
            fun_fact_url = f'http://numbersapi.com/{number}/math?json'
            fun_fact_response = requests.get(fun_fact_url)

            if fun_fact_response.status_code != 200:
                fun_fact = "Fun fact not found."
            else:
                fun_fact_data = fun_fact_response.json()
                fun_fact = fun_fact_data['text']
            
            cache.set(cache_key, fun_fact, timeout=60*60)  # Cache the fun fact for 1 hour

        properties = []
        if is_armstrong(number):
            properties.append('armstrong')
        if number % 2 == 0:
            properties.append('even')
        else:
            properties.append('odd')

        data = {
            "number": number,
            "is_prime": is_prime(number),
            "is_perfect": is_perfect(number),
            "properties": properties,
            "digit_sum": sum(int(digit) for digit in str(number)),
            "fun_fact": fun_fact
        }

        serializer = NumberSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
